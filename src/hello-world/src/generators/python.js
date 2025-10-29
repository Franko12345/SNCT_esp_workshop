/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/python';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

forBlock['left_motor_on'] = function (block, generator) {
  const code = 'left_motor_on()\n'; 
  return code;
}

forBlock['left_motor_off'] = function (block, generator) {
  const code = 'left_motor_off()\n'; 
  return code;
}

forBlock['right_motor_off'] = function (block, generator) {
  const code = 'right_motor_off()\n'; 
  return code;
}

forBlock['right_motor_on'] = function (block, generator) {
  const code = 'right_motor_on()\n'; 
  return code;
}

forBlock['go_forward'] = function (block, generator) {
  const code = 'go_forward()\n'; 
  return code;
}

forBlock['go_backward'] = function (block, generator) {
  const code = 'go_backward()\n'; 
  return code;
}

forBlock['go_left'] = function (block, generator) {
  const code = 'go_left()\n'; 
  return code;
}

forBlock['go_right'] = function (block, generator) {
  const code = 'go_right()\n'; 
  return code;
}

forBlock['motor_left_speed'] = function (block, generator) {
  const velocidade = generator.valueToCode(block, 'VELOCIDADE', Order.NONE) || '0';
  const code = `set_left_motor_speed(${velocidade})\n`; 
  return code;
}

forBlock['motor_right_speed'] = function (block, generator) {
  const velocidade = generator.valueToCode(block, 'VELOCIDADE', Order.NONE) || '0';
  const code = `set_right_motor_speed(${velocidade})\n`; 
  return code;
}

forBlock['drive_speed'] = function (block, generator) {
  const velocidade = generator.valueToCode(block, 'VELOCIDADE', Order.NONE) || '0';
  const code = `set_drive_speed(${velocidade})\n`; 
  return code;
}

forBlock['stop'] = function (block, generator) {
  const code = 'stop_motors()\n'; 
  return code;
}

forBlock['sound_buzzer'] = function (block, generator) {
  const code = 'sound_buzzer()\n'; 
  return code;
}

forBlock['stop_buzzer'] = function (block, generator) {
  const code = 'stop_buzzer()\n'; 
  return code;
}

forBlock['set_buzzer_frequency'] = function (block, generator) {
  const frequency = generator.valueToCode(block, 'FREQUENCY', Order.NONE) || '0';
  const code = `set_buzzer_frequency(${frequency})\n`; 
  return code;
}

forBlock['set_buzzer_duration'] = function (block, generator) {
  const duration = generator.valueToCode(block, 'DURATION', Order.NONE) || '0';
  const code = `set_buzzer_duration(${duration})\n`; 
  return code;
}

forBlock['turn_on_led_one'] = function (block, generator) {
  const code = 'turn_on_led_one()\n'; 
  return code;
}

forBlock['turn_off_led_one'] = function (block, generator) {
  const code = 'turn_off_led_one()\n'; 
  return code;
}

forBlock['turn_on_led_two'] = function (block, generator) {
  const code = 'turn_on_led_two()\n'; 
  return code;
}

forBlock['turn_off_led_two'] = function (block, generator) {
  const code = 'turn_off_led_two()\n'; 
  return code;
}

forBlock['ir_controller_read'] = function (block, generator) {
  const code = 'ir_controller_read()'; 
  return [code, Order.FUNCTION_CALL];
}

forBlock['ir_controller_key'] = function (block, generator) {
  // Obtém o valor selecionado no dropdown (o segundo elemento da array de options)
  const key = block.getFieldValue('KEY');
  
  // O código Python será a string literal da tecla, entre aspas.
  // Ex: "'KEY_UP'"
  const code = generator.quote_(key); 
  
  // Retorna a string de código e a precedência para string literal.
  return [code, Order.ATOMIC]; // Order.ATOMIC é para valores literais
}

forBlock['program_setup'] = function(block, generator) {
  // Extrai o código dos blocos conectados à área de encaixe "DO"
  const statements = generator.statementToCode(block, 'DO');
  
  // Define o código da função setup()
  const code = `def setup():\n${generator.prefixLines(statements, generator.INDENT)}\n\n`;
  return code;
};


// 2. Gerador para o bloco LOOP
forBlock['program_loop'] = function(block, generator) {
  // Extrai o código dos blocos conectados à área de encaixe "DO"
  const statements = generator.statementToCode(block, 'DO');

  // Define o código da função loop() e a lógica de execução principal
  const code = `def loop():\n${generator.prefixLines(statements, generator.INDENT)}\n\n`;
  
  // Adiciona a chamada de execução (executa setup e depois loop infinitamente)
  // Nota: Isto será anexado ao final do código gerado após o 'setup'
  const executionCode = 'if __name__ == "__main__":\n' +
                        `${generator.INDENT}setup()\n` +
                        `${generator.INDENT}while True:\n` +
                        `${generator.INDENT}${generator.INDENT}loop()\n`;

  // Este bloco é um "statement", então ele é anexado. 
  // Retornamos a função 'loop' e a lógica de execução principal.
  return code + executionCode;
};

forBlock['get_ultrasonic_distance'] = function (block, generator) {
  const code = 'get_ultrasonic_distance()'; 
  return [code, Order.FUNCTION_CALL];
}