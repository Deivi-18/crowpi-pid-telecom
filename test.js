/*******************************************************************************
 * ARCHIVO DE PRUEBA - CONTROL PID PARA TELECOMUNICACIONES
 *
 * Autor: Jose David Lopez Avila
 * C.I: 30.901.291
 * Ingeniero en Telecomunicaciones
 *
 * Este archivo prueba el funcionamiento del controlador PID sin hardware real
 * Simula lecturas de sensor y verifica la lógica de control
 *
 ******************************************************************************/

// Archivo de prueba simple
console.log("🧪 Sistema PID para CrowPi - Pruebas");
console.log("👨‍💻 Autor: Jose David Lopez Avila");
console.log("📅 Fecha: 31 de octubre de 2026");

// Simulación básica del PID
function simulatePID() {
  console.log("\n📊 Simulación del algoritmo PID:");

  const setpoint = 512;
  const Kp = 0.8,
    Ki = 0.15,
    Kd = 0.05;
  let integralError = 0;
  let previousError = 0;

  // Simular algunas iteraciones
  for (let i = 1; i <= 5; i++) {
    const currentPower = 500 + Math.random() * 50 - 25;
    const error = setpoint - currentPower;

    // Términos PID
    const pTerm = Kp * error;
    integralError += error * 0.1; // deltaTime simulado
    const iTerm = Ki * integralError;
    const derivative = (error - previousError) / 0.1;
    const dTerm = Kd * derivative;

    const output = pTerm + iTerm + dTerm;
    const pwmOutput = Math.max(0, Math.min(255, Math.floor(output)));

    console.log(`Iteración ${i}:`);
    console.log(`  Potencia: ${currentPower.toFixed(1)}`);
    console.log(`  Error: ${error.toFixed(1)}`);
    console.log(`  PWM: ${pwmOutput}/255`);

    previousError = error;
  }
}

simulatePID();
