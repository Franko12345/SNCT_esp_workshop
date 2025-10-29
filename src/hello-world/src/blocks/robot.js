/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly/core';

// Create a custom block called 'add_text' that adds
// text to the output div on the sample app.
// This is just an example and you should replace this with your
// own custom blocks.
const motorLeftOn = {
  "type": "left_motor_on",
  "tooltip": "Gira o motor",
  "helpUrl": "",
  "message0": "Girar Motor Esquerda",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#1170E4"
};

const motorLeftOff = {
  "type": "left_motor_off",
  "tooltip": "Gira o motor",
  "helpUrl": "",
  "message0": "Parar Motor Esquerda",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#1170E4"
};

const motorRightOn = {
  "type": "right_motor_on",
  "tooltip": "Gira o motor",
  "helpUrl": "",
  "message0": "Girar Motor Direita",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#1170E4"
};

const motorRightOff = {
  "type": "right_motor_off",
  "tooltip": "Gira o motor",
  "helpUrl": "",
  "message0": "Parar Motor Direita",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#1170E4"
};

const motorLeftSpeed = {
  "type": "motor_left_speed",
  "message0": "Definir velocidade do Motor da Esquerda para %1",
  "args0": [
    {
      "type": "input_value",
      "name": "VELOCIDADE",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#1170E4",
  "tooltip": "Define a velocidade do motor esquerdo. O valor deve ser um número.",
  "helpUrl": ""
}

const motorRightSpeed = {
  "type": "motor_right_speed",
  "message0": "Definir velocidade do Motor da Direita para %1",
  "args0": [
    {
      "type": "input_value",
      "name": "VELOCIDADE",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#1170E4",
  "tooltip": "Define a velocidade do motor direito. O valor deve ser um número.",
  "helpUrl": ""
}

const goForward = {
  "type": "go_forward",
  "tooltip": "Anda para frente",
  "helpUrl": "",
  "message0": "Andar para Frente",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF47DD"
};

const goBackward = {
  "type": "go_backward",
  "tooltip": "Anda para trás",
  "helpUrl": "",
  "message0": "Andar para Trás",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF47DD"
};

const goLeft = {
  "type": "go_left",
  "tooltip": "Vira para a esquerda",
  "helpUrl": "",
  "message0": "Virar para a Esquerda",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF47DD"
};

const goRight = {
  "type": "go_right",
  "tooltip": "Vira para a direita",
  "helpUrl": "",
  "message0": "Virar para a Direita",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF47DD"
};

const stop = {
  "type": "stop",
  "tooltip": "Para os motores da tração",
  "helpUrl": "",
  "message0": "Parar Motores",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF47DD"
};

const driveSpeed = {
  "type": "drive_speed",
  "message0": "Definir Velocidade para %1",
  "args0": [
    {
      "type": "input_value",
      "name": "VELOCIDADE",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#FF47DD",
  "tooltip": "Define a velocidade de todos os motores. O valor deve ser um número.",
  "helpUrl": ""
};

const soundBuzzer = {
  "type": "sound_buzzer",
  "tooltip": "Ativa o buzzer",
  "helpUrl": "",
  "message0": "Ativar Buzzer",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#B941F1"
};

const stopBuzzer = {
  "type": "stop_buzzer",
  "tooltip": "Desativa o buzzer",
  "helpUrl": "",
  "message0": "Desativar Buzzer",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#B941F1"
};

const setBuzzerFrequency = {
  "type": "set_buzzer_frequency",
  "message0": "Definir frequência do Buzzer para %1 Hz",
  "args0": [
    {
      "type": "input_value",
      "name": "FREQUENCY",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#B941F1",
  "tooltip": "Define a frequência do buzzer. O valor deve ser um número.",
  "helpUrl": ""
};

const setBuzzerDuration = {
  "type": "set_buzzer_duration",
  "message0": "Definir duração do Buzzer para %1 ms",
  "args0": [
    {
      "type": "input_value",
      "name": "DURATION",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#B941F1",
  "tooltip": "Define a duração do buzzer. O valor deve ser um número.",
  "helpUrl": ""
};

const turnOnLedOne = {
  "type": "turn_on_led_one",
  "tooltip": "Liga o LED 1",
  "helpUrl": "",
  "message0": "Ligar LED 1",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#B941F1"
};

const turnOffLedOne = {
  "type": "turn_off_led_one",
  "tooltip": "Desliga o LED 1",
  "helpUrl": "",
  "message0": "Desligar LED 1",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#B941F1"
};

const turnOnLedTwo = {
  "type": "turn_on_led_two",
  "tooltip": "Liga o LED 2",
  "helpUrl": "",
  "message0": "Ligar LED 2",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#B941F1"
};

const turnOffLedTwo = {
  "type": "turn_off_led_two",
  "tooltip": "Desliga o LED 2",
  "helpUrl": "",
  "message0": "Desligar LED 2",
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#B941F1"
};

const getUltrasonicDistance = {
  "type": "get_ultrasonic_distance",
  "message0": "Distância do Sensor Ultrassônico (cm)",
  "tooltip": "Lê a distância medida pelo sensor ultrassônico em centímetros.",
  "output": "Number",
  "colour": "#B941F1"
};

const getControllerButton = {
  "type": "ir_controller_read",
  "message0": "Tecla pressionada (IR)",
  "output": "String",
  "colour": 30,
  "tooltip": "Lê o código da última tecla pressionada no controle remoto IR. Retorna uma String vazia se nenhuma tecla for pressionada.",
  "helpUrl": "",
  "colour": "#B941F1"
}

const conrollerButtons = {
  "type": "ir_controller_key",
  "message0": "Tecla %1",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "KEY",
      "options": [
        ["0", "KEY_0"],
        ["1", "KEY_1"],
        ["2", "KEY_2"],
        ["3", "KEY_3"],
        ["4", "KEY_4"],
        ["5", "KEY_5"],
        ["6", "KEY_6"],
        ["7", "KEY_7"],
        ["8", "KEY_8"],
        ["9", "KEY_9"],
        ["Esquerda", "KEY_LEFT"],
        ["Direita", "KEY_RIGHT"],
        ["Cima", "KEY_UP"],
        ["Baixo", "KEY_DOWN"],
        ["Centro", "KEY_CENTER"],
        ["Ponto (##)", "KEY_POUND"],
        ["Asterisco (*)", "KEY_ASTERISK"]
      ]
    }
  ],
  "output": "String",
  "colour": "#B941F1",
  "tooltip": "Seleciona uma tecla específica do controle remoto IR. Retorna o código da tecla como String.",
  "helpUrl": ""
};

const setup = {
  "type": "program_setup",
  "message0": "Quando Iniciar: %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "nextStatement": null,
  "colour": 330,
  "tooltip": "Código executado uma única vez ao iniciar o programa (função setup).",
  "helpUrl": ""
};

const loop = {
  "type": "program_loop",
  "message0": "Enquanto estiver rodando: %1",
  "args0": [
    {
      "type": "input_statement",
      "name": "DO"
    }
  ],
  "previousStatement": "program_setup",
  "colour": 300,
  "tooltip": "Código executado repetidamente (função loop).",
  "helpUrl": ""
};

const waitTime = {
  "type": "wait_time",
  "message0": "Esperar %1 s",
  "args0": [
    {
      "type": "input_value",
      "name": "DURATION",
      "check": "Number"
    }
  ],
  "previousStatement": null,
  "nextStatement": null,
  "colour": "#B941F1",
  "tooltip": "Faz o programa esperar um determinado tempo em segundos.",
  "helpUrl": ""
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const robotBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  motorLeftOn,
  motorLeftOff,
  motorRightOn,
  motorRightOff,
  goForward,
  goBackward,
  goLeft,
  goRight,
  motorLeftSpeed,
  motorRightSpeed,
  stop,
  driveSpeed,
  soundBuzzer,
  stopBuzzer,
  setBuzzerFrequency,
  setBuzzerDuration,
  turnOnLedOne,
  turnOffLedOne,
  turnOnLedTwo,
  turnOffLedTwo,
  getUltrasonicDistance,
  getControllerButton,
  setup,
  loop,
  conrollerButtons,
  waitTime
]);
