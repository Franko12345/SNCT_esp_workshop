from machine import Pin, PWM, time_pulse_us
from time import sleep, sleep_us, ticks_us, ticks_diff
from ultrassonic import HCSR04

# === DEFINIÇÃO DE PINOS ===

PIN_MOTOR_ESQ_t = 23
PIN_MOTOR_ESQ_f = 22
PIN_MOTOR_DIR_t = 32
PIN_MOTOR_DIR_f = 33
PIN_LED_1 = 18
PIN_LED_2 = 20
PIN_BUZZER = 14
PIN_ULTRASONIC_ECHO = 25
PIN_ULTRASONIC_TRIG = 26
PIN_IR = 27

buzzer_freq = 1000
buzzer_duracao = 0.3

# Motores (controle simples — HIGH liga, LOW desliga)
motor_frente_esq = PWM(Pin(PIN_MOTOR_ESQ_f, Pin.OUT, Pin.PULL_DOWN), 1000)
motor_tras_esq = PWM(Pin(PIN_MOTOR_ESQ_t, Pin.OUT, Pin.PULL_DOWN), 1000)

motor_frente_dir = PWM(Pin(PIN_MOTOR_DIR_f, Pin.OUT, Pin.PULL_DOWN), 1000)
motor_tras_dir = PWM(Pin(PIN_MOTOR_DIR_t, Pin.OUT, Pin.PULL_DOWN), 1000)

motor_frente_esq.deinit()
motor_tras_esq.deinit()
motor_frente_dir.deinit()
motor_tras_dir.deinit()

motor_frente_esq.init(1000, 0)
motor_tras_esq.init(1000, 0)
motor_frente_dir.init(1000, 0)
motor_tras_dir.init(1000, 0)

motor_left_speed = 512
motor_right_speed = 512
drive_speed = 512


# Sensor Ultrassônico
ultra = HCSR04(PIN_ULTRASONIC_TRIG, PIN_ULTRASONIC_ECHO)

# Receptor IR
ir_pin = Pin(PIN_IR, Pin.IN)

# Buzzer
buzzer = PWM(Pin(PIN_BUZZER, Pin.OUT, Pin.PULL_DOWN), 1000)
buzzer.deinit()
buzzer.init(1000, 0)


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

def left_motor_on():
    global motor_left_speed
    motor_frente_esq.duty(motor_left_speed)
    motor_tras_esq.duty(0)
def left_motor_off():
    motor_frente_esq.duty(0)
    motor_tras_esq.duty(0)
def right_motor_on():
    global motor_right_speed
    motor_frente_dir.duty(motor_right_speed)
    motor_tras_dir.duty(0)
def right_motor_off():
    motor_frente_dir.duty(0)
    motor_tras_dir.duty(0)

def set_left_motor_speed(speed):
    """Define a velocidade do motor esquerdo (0-1023)."""
    global motor_left_speed
    motor_left_speed = max(0, min(1023, speed))

def set_right_motor_speed(speed):
    """Define a velocidade do motor direito (0-1023)."""
    global motor_right_speed
    motor_right_speed = max(0, min(1023, speed))

def set_drive_speed(speed):
    """Define a velocidade padrão de movimento (0-1023)."""
    global drive_speed
    drive_speed = max(0, min(1023, speed))

# === FUNÇÕES DE CONTROLE DE MOTORES ===
def parar():
    motor_frente_dir.duty(0)
    motor_tras_dir.duty(0)

    motor_frente_esq.duty(0)
    motor_tras_esq.duty(0)

def andar_frente():
    motor_frente_dir.duty(drive_speed)
    motor_tras_dir.duty(0)

    motor_frente_esq.duty(drive_speed)
    motor_tras_esq.duty(0)

def andar_tras():
    motor_frente_dir.duty(0)
    motor_tras_dir.duty(drive_speed)

    motor_frente_esq.duty(0)
    motor_tras_esq.duty(drive_speed)

def girar_esquerda():
    motor_frente_dir.duty(drive_speed)
    motor_tras_dir.duty(0)

    motor_frente_esq.duty(0)
    motor_tras_esq.duty(drive_speed)


def girar_direita():
    motor_frente_dir.duty(0)
    motor_tras_dir.duty(drive_speed)

    motor_frente_esq.duty(drive_speed)
    motor_tras_esq.duty(0)


# === FUNÇÕES DO SENSOR ULTRASSÔNICO ===
def medir_distancia_cm():
    return ultra.distance_cm()


# === FUNÇÕES DO BUZZER ===
def tocar_buzzer(freq=buzzer_freq, duracao=buzzer_duracao):
    buzzer.freq(freq)
    buzzer.duty(512) # 50%
    sleep(duracao)
    buzzer.duty(0)

def set_buzzer_duration(duracao):
    global buzzer_duracao
    buzzer_duracao = duracao

def set_buzzer_frequency(freq):
    global buzzer_freq
    buzzer_freq = freq

def buzzer_on(freq=buzzer_freq):
    buzzer.freq(freq)
    buzzer.duty(512) # 50%

def buzzer_off():
    buzzer.duty(0)

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

