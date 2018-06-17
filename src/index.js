import songUrl from './song.mp3'
import axios from 'axios'

const $ = (slt) => document.querySelector(slt)

const audioCtx = new AudioContext()
const source = audioCtx.createBufferSource()
const analyser = audioCtx.createAnalyser()
const vizData = new Uint8Array(analyser.frequencyBinCount)
const $viz = $('#viz')

analyser.fftSize = 2048

axios.get(songUrl, { responseType: 'arraybuffer' }).then((res) => {
  audioCtx.decodeAudioData(res.data).then((buffer) => {
    source.buffer = buffer
    source.connect(analyser)
    source.connect(audioCtx.destination)
    source.start()
  })
}).catch(err => console.error('ERROR: ', err))

function lerp (a, b, x) {
  return a + (b - a) * x
}

function animViz () {
  analyser.getByteTimeDomainData(vizData)

  const factor = vizData[0] / 100

  $viz.style.transform = `translate(-50%, -50%) scaleY(${factor}) scaleX(${factor})`
}

setInterval(animViz, 100)
