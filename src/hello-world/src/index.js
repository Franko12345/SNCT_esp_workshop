/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {robotBlocks} from './blocks/robot';
import {forBlock} from './generators/python';
import DarkTheme from '@blockly/theme-dark';
import {pythonGenerator} from 'blockly/python';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import './index.css';
import { text } from '@sveltejs/kit';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(robotBlocks);
Object.assign(pythonGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');
const textarea = document.getElementById('code');
const ws = Blockly.inject(blocklyDiv, {
  toolbox: toolbox,
  theme: DarkTheme,
  renderer: 'zelos',
  zoom: {
    controls: true, // Adiciona botões de zoom (+ e -) e ajuste
    wheel: true,    // Habilita o zoom com a roda do mouse/scroll
    startScale: 1.0, // Nível de zoom inicial
    maxScale: 3,     // Zoom máximo permitido
    minScale: 0.3,   // Zoom mínimo permitido
    scaleSpeed: 1.2  // Velocidade de alteração do zoom
  }
});

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  const code = pythonGenerator.workspaceToCode(ws);


  // STRING DO CÓDIGO GERADO
  codeDiv.innerText = code;
  textarea.value = code;

  console.log("bolas");

  outputDiv.innerHTML = '';

  // eval(code);
};

// Load the initial state from storage and run the code.
load(ws);
runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
  console.log("bolas");
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (
    e.isUiEvent ||
    e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()
  ) {
    return;
  }
  runCode();
});

/* --- Simple tab switcher --- */
    const tabBlockly = document.getElementById('tabBlockly');
    const tabIDE = document.getElementById('tabIDE');
    const blocklySection = document.getElementById('blocklySection');
    const ideSection = document.getElementById('senderSection');

    tabBlockly.onclick = () => {
      tabBlockly.classList.add('active');
      tabIDE.classList.remove('active');
      blocklySection.classList.add('active');
      ideSection.classList.remove('active');
    };
    tabIDE.onclick = () => {
      tabIDE.classList.add('active');
      tabBlockly.classList.remove('active');
      ideSection.classList.add('active');
      blocklySection.classList.remove('active');
    };
    // CONFIGURÁVEL
    const DEFAULT_SERVER = '0.0.0.0'; // altere aqui se desejar

    // Elementos
    const sendBtn = document.getElementById('sendBtn');
    const runBtn = document.getElementById('runBtn');
    const logEl = document.getElementById('log');
    const serverInput = document.getElementById('serverInput');
    const serverLabel = document.getElementById('serverLabel');
    const clearBtn = document.getElementById('clearBtn');

    // Inicializa
    serverInput.value = DEFAULT_SERVER;
    serverLabel.textContent = DEFAULT_SERVER;

    function log(msg, type){
      const time = new Date().toLocaleTimeString();
      const line = document.createElement('div');
      line.textContent = `[${time}] ${msg}`;
      if(type === 'err') line.style.color = 'var(--danger)';
      else if(type === 'ok') line.style.color = 'var(--success)';
      logEl.prepend(line);
    }

    function setUIBusy(busy, sending=true){
      sendBtn.disabled = busy;
      sendBtn.textContent = busy ? (sending ? 'Enviando...' : "Rodando...") : 'Enviar Código';
      runBtn.disabled = busy;
      runBtn.textContent = busy ? (sending ? 'Enviando...' : "Rodando...") : 'Rodar Código';
    }

    // keyboard shortcut Ctrl+Enter
    textarea.addEventListener('keydown', (e)=>{
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
        e.preventDefault();
        sendBtn.click();
      }
    });

    // Atualiza label quando muda
    serverInput.addEventListener('input', ()=>{
      serverLabel.textContent = serverInput.value || DEFAULT_SERVER;
    });

    clearBtn.addEventListener('click', ()=>{ textarea.value = ''; log('Editor limpo.'); textarea.focus(); });

    // Função principal de envio
    async function sendCodeFlow(){
      const server = (serverInput.value || DEFAULT_SERVER).trim().replace(/\/+$/, ''); // remove trailing slash
      serverLabel.textContent = server;
      const code = textarea.value;
      // const code = pythonGenerator.workspaceToCode(ws);
      if (!code || code.trim().length === 0){ log('O campo está vazio — nada a enviar.', 'err'); return; }

      // 1) enviar size como argumento (GET ?size=)
      setUIBusy(true, true);
      // 2) enviar código no body (POST /code)
      try {
        const codeUrl = `${server}/code`;
        log(`Enviando código para: ${codeUrl}`);
        const respCode = await fetch(codeUrl, {
          method: 'POST',
          // mode: 'cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: code,
        });

        if (!respCode.ok) {
          const txt = await safeText(respCode);
          throw new Error(`Status ${respCode.status} — ${txt || 'sem corpo'}`);
        }

        const responseText = await safeText(respCode);
        log(`Código enviado com sucesso (status ${respCode.status}).`, 'ok');
        if (responseText) log(`Resposta do servidor: ${responseText}`);
      } catch (err) {
        log(`Falha ao enviar código: ${err.message}`, 'err');
      } finally {
        setUIBusy(false);
      }
    }

    async function stopCode(){
      setUIBusy(true, false);
      const server = (serverInput.value || DEFAULT_SERVER).trim().replace(/\/+$/, ''); // remove trailing slash
        const codeUrl = `${server}/restart`;
        log(`Parando o código`);
        try{
          const respCode = await fetch(codeUrl, {
            method: 'POST',
          });
        }catch(err){
          console.log(err);
        }

        setUIBusy(false);
    }

    async function sendRunSignal(){
      const server = (serverInput.value || DEFAULT_SERVER).trim().replace(/\/+$/, ''); // remove trailing slash
      serverLabel.textContent = server;

      setUIBusy(true, false);

      try {
        const runUrl = `${server}/run`;
        log(`Enviando sinal de execução para: ${runUrl}`);
        const respCode = await fetch(runUrl, {
          method: 'POST',
        });

        if (!respCode.ok) {
          const txt = await safeText(respCode);
          throw new Error(`Status ${respCode.status} — ${txt || 'sem corpo'}`);
        }

        const responseText = await safeText(respCode);
        log(`Código enviado com sucesso (status ${respCode.status}).`, 'ok');
        if (responseText) log(`Resposta do servidor: ${responseText}`);
      } catch (err) {
        log(`Falha ao enviar código: ${err.message}`, 'err');
      } finally {
        setUIBusy(false);
      }
    }
    async function safeText(resp){
      try { return await resp.text(); } catch(e){ return null; }
    }

    sendBtn.addEventListener('click', sendCodeFlow);
    runBtn.addEventListener('click', sendRunSignal);
    stopBtn.addEventListener('click', stopCode);

    // Sugestão visual: preencha um código de exemplo curto
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    // Avisos iniciais:
    log('Pronto. Verifique se o servidor em 192.168.3.50 aceita CORS e se não há bloqueio por mixed-content (HTTPS).');
