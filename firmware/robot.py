from machine import Pin, PWM, time_pulse_us
from time import sleep, sleep_us, ticks_us, ticks_diff

# === DEFINIÇÃO DE PINOS ===

PIN_MOTOR_ESQ = 12
PIN_MOTOR_DIR = 13
PIN_LED_1 = 18
PIN_LED_2 = 19
PIN_BUZZER = 17
PIN_ULTRASONIC_ECHO = 15
PIN_ULTRASONIC_TRIG = 14
PIN_IR = 16

# Motores (controle simples — HIGH liga, LOW desliga)
motor_esq = Pin(PIN_MOTOR_ESQ, Pin.OUT)
motor_dir = Pin(PIN_MOTOR_DIR, Pin.OUT)

# Sensor Ultrassônico
trig = Pin(PIN_ULTRASONIC_TRIG, Pin.OUT)
echo = Pin(PIN_ULTRASONIC_ECHO, Pin.IN)

# Receptor IR
ir_pin = Pin(PIN_IR, Pin.IN)

# Buzzer
buzzer = PWM(Pin(PIN_BUZZER), 500)

IR_CODES = {
    0x45: "1",
    0x46: "2",
    0x47: "3",
    0x44: "4",
    0x40: "5",
    0x43: "6",
    0x07: "7",
    0x15: "8",
    0x09: "9",
    0x19: "0",
    0x16: "*",
    0x0D: "#",
    0x18: "UP",
    0x52: "DOWN",
    0x08: "LEFT",
    0x5A: "RIGHT",
    0x1C: "OK"
}

# === FUNÇÕES DE CONTROLE DE MOTORES ===
def parar():
    motor_esq.off()
    motor_dir.off()

def andar_frente():
    motor_esq.on()
    motor_dir.on()

def girar_esquerda():
    motor_esq.off()
    motor_dir.on()

def girar_direita():
    motor_esq.on()
    motor_dir.off()


# === FUNÇÕES DO SENSOR ULTRASSÔNICO ===
def medir_distancia_cm():
    trig.off()
    sleep_us(2)
    trig.on()
    sleep_us(10)
    trig.off()

    while echo.value() == 0:
        pulse_start = ticks_us()
    while echo.value() == 1:
        pulse_end = ticks_us()

    duracao = ticks_diff(pulse_end, pulse_start)
    distancia_cm = (duracao / 2) / 29.1
    return distancia_cm


# === FUNÇÕES DO BUZZER ===
def tocar_buzzer(freq=1000, duracao=0.3):
    buzzer.freq(freq)
    buzzer.duty_u16(32768) # 50%
    sleep(duracao)
    buzzer.duty_u16(0)

def buzzer_on(freq=1000):
    buzzer.freq(freq)
    buzzer.duty_u16(32768) # 50%

def buzzer_off():
    buzzer.duty_u16(0)

# === FUNÇÕES DE LEITURA IR ===
def decode_ir():
    """Decodifica o protocolo NEC e retorna o comando (byte)."""
    # Espera início do sinal
    while ir_pin.value() == 1:
        pass

    # Start sequence: ~9ms LOW + ~4.5ms HIGH
    if time_pulse_us(ir_pin, 0, 100000) < 8000:
        return None
    if time_pulse_us(ir_pin, 1, 100000) < 4000:
        return None

    # Lê 32 bits
    data = 0
    for i in range(32):
        time_pulse_us(ir_pin, 0, 100000)  # 560µs LOW
        t = time_pulse_us(ir_pin, 1, 100000)
        if t > 1000:  # ~1.69ms HIGH => bit 1
            data = (data << 1) | 1
        else:         # ~560µs HIGH => bit 0
            data = (data << 1)

    cmd = (data >> 16) & 0xFF
    inv_cmd = (data >> 8) & 0xFF
    if cmd != (inv_cmd ^ 0xFF):
        return None

    return cmd


def ir_button_code():
    """Lê o código numérico do botão pressionado."""
    code = None
    while code is None:
        code = decode_ir()
    return code


def ir_button_name():
    """Retorna o nome do botão (ex: 'UP', '1', 'OK')."""
    code = ir_button_code()
    return IR_CODES.get(code, f"UNKNOWN({hex(code)})")
