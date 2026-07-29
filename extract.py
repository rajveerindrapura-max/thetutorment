import zipfile
import os

zip_path = "/Users/rajveersingh/Downloads/Archive/tutorment-project.zip"
out_dir = "/Users/rajveersingh/Downloads/Archive/tutorment-project"

os.makedirs(out_dir, exist_ok=True)

with zipfile.ZipFile(zip_path, 'r') as z:
    for member in z.infolist():
        if '{' in member.filename or '}' in member.filename:
            print(f"Skipping entry: {member.filename}")
            continue
        
        target_path = os.path.join(out_dir, member.filename)
        if member.is_dir():
            os.makedirs(target_path, exist_ok=True)
        else:
            os.makedirs(os.path.dirname(target_path), exist_ok=True)
            with z.open(member) as src, open(target_path, 'wb') as dst:
                dst.write(src.read())

print("Successfully extracted tutorment-project.zip into tutorment-project/")
