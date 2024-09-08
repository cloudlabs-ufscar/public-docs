import os

from PIL import Image


def crop_to_square(img):
    width, height = img.size
    max_side = min(width, height)
    left = (width - max_side) // 2
    top = (height - max_side) // 2
    right = left + max_side
    bottom = top + max_side
    return img.crop((left, top, right, bottom))


def resize_images(input_dir, output_dir):
    # Ensure output directory exists
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Get all image files in the input directory
    image_files = [
        f
        for f in os.listdir(input_dir)
        if f.lower().endswith((".png", ".jpg", ".jpeg"))
    ]

    for image_file in image_files:
        # Construct full paths
        input_path = os.path.join(input_dir, image_file)
        output_path = os.path.join(output_dir, image_file)

        try:
            # Open the image
            with Image.open(input_path) as img:
                # Determine if cropping is needed
                width, height = img.size
                if width != height:
                    # Crop to square
                    img = crop_to_square(img)

                # Resize the image
                resized_img = img.resize((200, 200), Image.ANTIALIAS)
                # Save the processed image
                resized_img.save(output_path)
            print(f"Processed: {image_file}")
        except Exception as e:
            print(f"Error processing {image_file}: {str(e)}")


def main():
    input_directory = "static/img/members"
    output_directory = "static/img/members"

    resize_images(input_directory, output_directory)


if __name__ == "__main__":
    main()
