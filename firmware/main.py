import network
import esp
import time
import _thread
import uasyncio as asyncio
from machine import Pin
import machine
from microdot import Microdot, Response, send_file
from microdot_cors import CORS
import machine

from robot import *

machine.freq(240000000)
addr = ""
def do_connect():
    global addr
    import machine, network
    
    network.WLAN(network.AP_IF).active(False)

    wlan = network.WLAN(network.STA_IF)
    wlan.active(False)
    wlan.active(True)

    wlan.config(dhcp_hostname="esp_kit")

    if not wlan.isconnected():
        print('connecting to network...')
        wlan.connect('salob', '12345678')
        while not wlan.isconnected():
            machine.idle()
    addr = wlan.ifconfig()
    print('network config: ', addr)

do_connect()

led = Pin(2, Pin.OUT)

app = Microdot()

cors = CORS(
    app,
    allowed_origins='*',                     # <-- string '*' (não ['*'])
    allow_credentials=False,
    allowed_methods=['GET', 'POST', 'OPTIONS'],
    allowed_headers=['Content-Type', 'Authorization'],  # recomendo incluir Authorization se for necessário
    max_age=3600
)

@app.route('/code', methods=["GET", "POST"])
async def index(request):
    code = request.body.decode("utf-8")
    with open("code", "w") as arq:
        arq.write(code)

    print(code)
    return Response("Code Recieved successfully!")

@app.route('/')
async def index(request):
    led.value(not led.value())
    return send_file("main.html")


@app.route('/run', methods=["GET", "POST"])
async def index(request):
    try:
        with open("code", "r") as arq:
            _thread.start_new_thread(exec, (arq.read(),))
            #exec(arq.read())
        return "Code Executed successfully!"

    except Exception as e:
        return Response("Error: " + e)

@app.route('/off', methods=["GET", "POST"])
async def index(requests):
    request.app.shutdown()
    return Response("Desligando...")


@app.route('/restart', methods=["GET", "POST"])
async def index(requests):
    machine.soft_reset()
    return Response("Restarting...")


app.run(port=80, debug=True)