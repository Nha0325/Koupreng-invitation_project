from rembg import remove
from PIL import Image

input_path = 'image.png'
output_path = 'icon_1.png'

input = Image.open(input_path)
output = remove(input)

output.save(output_path)  # ← this line must exist