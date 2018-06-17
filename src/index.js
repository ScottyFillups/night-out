import songUrl from './song.mp3'
import axios from 'axios'

const $ = (slt) => document.querySelector(slt)

let analyser
let vizData
const $viz = $('#viz')
const $play = $('#play')

function play () {
  const audioCtx = new AudioContext()
  const source = audioCtx.createBufferSource()

  analyser = audioCtx.createAnalyser()
  analyser.fftSize = 2048
  vizData = new Uint8Array(analyser.frequencyBinCount)
  $play.style.opacity = 0
  $play.style.cursor = "default"

  axios.get(songUrl, { responseType: 'arraybuffer' }).then((res) => {
    audioCtx.decodeAudioData(res.data).then((buffer) => {
      source.buffer = buffer
      source.loop = true
      source.connect(analyser)
      source.connect(audioCtx.destination)
      source.start()
    })
  }).catch(err => console.error('ERROR: ', err))

  setInterval(animViz, 100)
}

function animViz () {
  analyser.getByteTimeDomainData(vizData)

  const factor = vizData[0] / 130

  $viz.style.transform = `translate(-50%, -50%) scaleY(${factor}) scaleX(${factor})`
}

$play.addEventListener('click', play)
