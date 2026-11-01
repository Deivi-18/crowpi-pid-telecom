# 🛠️ Instalación de Git para Windows

## 📥 Descargar Git

1. **Visita**: https://git-scm.com/downloads
2. **Selecciona Windows** (descargará Git for Windows)
3. **Ejecuta el instalador** (git-installer.exe)

## ⚙️ Configuración de la instalación:

### Pantallas del instalador:

1. **License Agreement**: Acepta la licencia
2. **Select Components** (recomendado):
   - ✓ Git Bash Here
   - ✓ Git GUI Here
   - ✓ Associate .git* configuration files with the default text editor
   - ✓ Associate .sh files to be run with Bash

3. **Choose Editor**: Selecciona tu editor preferido (VS Code, Notepad++, etc.)

4. **Adjusting PATH environment** (IMPORTANTE):
   - Selecciona: **"Git from the command line and also from 3rd-party software"**

5. **Choosing HTTPS transport backend**:
   - Usa la opción por defecto: **"Use the OpenSSL library"**

6. **Configuring the line ending conversions**:
   - Selecciona: **"Checkout Windows-style, commit Unix-style line endings"**

7. **Configuring the terminal emulator**:
   - Selecciona: **"Use MinTTY"**

8. **Extra options**:
   - ✓ Enable file system caching
   - ✓ Enable Git Credential Manager

## 🔧 Verificar instalación:

Abre PowerShell o CMD y ejecuta:
```powershell
git --version
```

Deberías ver algo como: `git version 2.45.0.windows.1`

## 📁 Configuración inicial de Git:

```bash
# Configurar nombre de usuario
git config --global user.name "Jose David Lopez Avila"

# Configurar email
git config --global user.email "tu-email@dominio.com"

# Configurar editor preferido (opcional)
git config --global core.editor "code --wait"

# Configurar rama principal como 'main'
git config --global init.defaultBranch main

# Verificar configuración
git config --list
```

## 🚀 Comandos básicos para GitHub:

```bash
# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Hacer primer commit
git commit -m "Initial commit: Sistema PID para CrowPi"

# Ver estado
git status

# Ver historial
git log --oneline
```

## 🔗 Configurar GitHub:

1. **Crear cuenta** en [github.com](https://github.com) si no tienes
2. **Generar token de acceso** (para autenticación):
   - Ve a Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Genera nuevo token con scope `repo`
   - Copia el token (sólo se muestra una vez)

3. **Autenticar Git con GitHub**:
```bash
# Usando token
git remote add origin https://TU-TOKEN@github.com/tu-usuario/crowpi-pid-telecom.git

# O usando credenciales guardadas
git config --global credential.helper wincred
```

## 💡 Solución de problemas comunes:

### Error: "git is not recognized"
- Reinicia PowerShell/CMD después de instalar Git
- Verifica que Git esté en el PATH: `echo %PATH%`
- Reinstala Git seleccionando "Git from the command line" en PATH

### Error de autenticación:
```bash
# Limpiar credenciales
git credential-manager reject https://github.com

# Reconfigurar
git config --global --unset credential.helper
git config --system --unset credential.helper
```

### Error: "Updates were rejected"
```bash
# Forzar push inicial
git push -u origin main --force

# O hacer pull primero
git pull origin main --allow-unrelated-histories
```

## 📚 Recursos útiles:

- **Documentación oficial Git**: https://git-scm.com/doc
- **GitHub Learning Lab**: https://lab.github.com/
- **Git Cheat Sheet**: https://training.github.com/

## 🎯 Comandos para este proyecto:

```bash
# En la carpeta del proyecto
cd C:\Users\Deivi\Desktop\Type shit\Test

# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Commit inicial
git commit -m "Sistema PID CrowPi - Jose David Lopez Avila"

# Conectar con GitHub (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/crowpi-pid-telecom.git

# Subir código
git push -u origin main
```

## 🔐 Seguridad:

- **NUNCA** subas archivos `.env` con claves
- **NUNCA** commits contraseñas o API keys
- Usa `.gitignore` para archivos sensibles
- Considera usar Git Secrets para prevenir commits de datos sensibles

---

**¡Git instalado y configurado!** 🎉

Ahora puedes subir tu proyecto de Control PID a GitHub y compartirlo con la comunidad.

*Autor: Jose David Lopez Avila - C.I: 30.901.291 - Ingeniero en Telecomunicaciones*