import time
import pyaudio
import numpy as np
import soundfile as sf
from faster_whisper import WhisperModel

# Audio recording settings
FORMAT = pyaudio.paInt16  # 16-bit audio
CHANNELS = 1  # Mono
RATE = 16000  # Sample rate
CHUNK = 1024  # Buffer size
RECORD_SECONDS = 5  # Recording duration
OUTPUT_FILENAME = "live_audio.wav"

# Initialize PyAudio
audio = pyaudio.PyAudio()

# Start recording
print("Recording...")
stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)
frames = [stream.read(CHUNK) for _ in range(int(RATE / CHUNK * RECORD_SECONDS))]
print("Recording finished.")

# Stop and close the stream
stream.stop_stream()
stream.close()
audio.terminate()

# Convert byte data to NumPy array and save as WAV
audio_data = np.frombuffer(b"".join(frames), dtype=np.int16)
sf.write(OUTPUT_FILENAME, audio_data, RATE)

# Load Whisper model
model_size = "distil-large-v3"
# model = WhisperModel("large-v3", device="cuda", compute_type="float16")
model = WhisperModel(model_size, device="cpu", compute_type="int8")

# Measure transcription time
start_time = time.time()
segments, info = model.transcribe(OUTPUT_FILENAME, beam_size=5)
end_time = time.time()

# Calculate and print transcription time
transcription_time = end_time - start_time
print(f"Transcription took {transcription_time:.2f} seconds.")

# Print detected language and transcription
print(f"Detected language: {info.language} (Confidence: {info.language_probability:.2f})")
for segment in segments:
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
