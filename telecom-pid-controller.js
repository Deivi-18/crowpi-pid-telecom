/*******************************************************************************
 * SISTEMA DE CONTROL PID PARA TELECOMUNICACIONES - CROWPI
 *
 * Autor: Jose David Lopez Avila
 * C.I: 30.901.291
 * Ingeniero en Telecomunicaciones
 * Fecha: 31 de octubre de 2026
 ******************************************************************************/

const Gpio = require("pigpio").Gpio;
const Mcpadc = require("mcp-spi-adc");

class TelecomPIDController {
  constructor(setpoint = 512, Kp = 0.8, Ki = 0.15, Kd = 0.05) {
    // Configuración del PID
    this.setpoint = setpoint;
    this.Kp = Kp;
    this.Ki = Ki;
    this.Kd = Kd;

    // Variables de estado
    this.integralError = 0;
    this.previousError = 0;
    this.lastTime = Date.now();
    this.maxIntegral = 100;

    // Hardware CrowPi - GPIO18 para PWM
    this.pwmPin = 18;
    this.transmitter = new Gpio(this.pwmPin, {
      mode: Gpio.OUTPUT,
      alert: false,
    });

    // ADC MCP3008 para lectura del sensor
    this.adcChannel = 0;
    this.sensor = Mcpadc.open(
      this.adcChannel,
      {
        speedHz: 20000,
      },
      (err) => {
        if (err) {
          console.error("Error ADC MCP3008:", err.message);
        } else {
          console.log("ADC MCP3008 listo en CH0");
        }
      },
    );
    // Control de muestreo
    this.intervalId = null;
    this.sampleRateMs = 100;
    this.samplesCount = 0;
    this.totalError = 0;

    console.log(`PID iniciado - Setpoint: ${this.setpoint}`);
  }

  start() {
    console.log(`Control PID activo - Objetivo: ${this.setpoint}`);
    this.lastTime = Date.now();
    this.samplesCount = 0;
    this.totalError = 0;

    this.intervalId = setInterval(() => {
      this.sensor.read((err, reading) => {
        if (err) {
          console.error("Error sensor:", err.message);
          return;
        }

        const currentPower = Math.round(reading.value * 1023);
        this.evaluatePID(currentPower);
      });
    }, this.sampleRateMs);
  }
  evaluatePID(currentPower) {
    const currentTime = Date.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;

    if (deltaTime <= 0) return;

    // Error actual
    const error = this.setpoint - currentPower;
    this.totalError += Math.abs(error);
    this.samplesCount++;

    // Término Proporcional
    const pTerm = this.Kp * error;

    // Término Integral con Anti-Windup
    this.integralError += error * deltaTime;
    if (this.integralError > this.maxIntegral) {
      this.integralError = this.maxIntegral;
    } else if (this.integralError < -this.maxIntegral) {
      this.integralError = -this.maxIntegral;
    }
    const iTerm = this.Ki * this.integralError;

    // Término Derivativo
    const derivative = (error - this.previousError) / deltaTime;
    const dTerm = this.Kd * derivative;

    // Salida PID
    const rawOutput = pTerm + iTerm + dTerm;
    const pwmOutput = Math.floor(Math.max(0, Math.min(255, rawOutput)));

    // Control PWM
    this.transmitter.pwmWrite(pwmOutput);

    // Log cada 10 muestras
    if (this.samplesCount % 10 === 0) {
      const avgError = this.totalError / this.samplesCount;
      console.log(
        `Muestra ${this.samplesCount} | ` +
          `Pwr: ${currentPower}/${this.setpoint} | ` +
          `Err: ${error} | PWM: ${pwmOutput}`,
      );
    }

    this.previousError = error;
    this.lastTime = currentTime;
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.transmitter.pwmWrite(0);

    if (this.samplesCount > 0) {
      const avgError = this.totalError / this.samplesCount;
      console.log(
        `Muestras: ${this.samplesCount} | Error prom: ${avgError.toFixed(2)}`,
      );
    }

    console.log("Sistema detenido");
  }

  changeSetpoint(newSetpoint) {
    if (newSetpoint < 0 || newSetpoint > 1023) {
      console.error("Setpoint fuera de rango (0-1023)");
      return;
    }

    const oldSetpoint = this.setpoint;
    this.setpoint = newSetpoint;
    this.integralError = 0;

    console.log(`Setpoint cambiado: ${oldSetpoint} -> ${newSetpoint}`);
  }

  tunePID(newKp, newKi, newKd) {
    this.Kp = newKp;
    this.Ki = newKi;
    this.Kd = newKd;

    console.log(`PID ajustado: Kp=${newKp}, Ki=${newKi}, Kd=${newKd}`);
  }
}

// Instancia principal
const controller = new TelecomPIDController(512, 0.8, 0.15, 0.05);
controller.start();

// Manejo Ctrl+C
process.on("SIGINT", () => {
  console.log("\nDeteniendo sistema...");
  controller.stop();
  setTimeout(() => {
    console.log("Sistema finalizado");
    process.exit(0);
  }, 500);
});

process.on("SIGTERM", () => {
  controller.stop();
  process.exit(0);
});
