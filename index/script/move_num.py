import os
import shutil
import random

A = r"E:\nn"  # Replace with your source main folder
B = r"E:\c"  # Replace with your target main folder


# Settings
start_folder_num = 135
max_files_per_folder = 5000
files_per_batch = 10

# Initialize counters
current_b_folder_index = start_folder_num
current_b_folder_file_count = 0
current_b_folder_path = os.path.join(B, str(current_b_folder_index))
os.makedirs(current_b_folder_path, exist_ok=True)

file_index = 1  # For naming inside B folders

# Helper: get list of non-empty subdirectories in A
def get_non_empty_subdirs(path):
    subdirs = []
    for d in os.listdir(path):
        full_path = os.path.join(path, d)
        if os.path.isdir(full_path):
            if any(os.path.isfile(os.path.join(full_path, f)) for f in os.listdir(full_path)):
                subdirs.append(full_path)
    return subdirs

while True:
    subdirs = get_non_empty_subdirs(A)
    if not subdirs:
        print("No files left in any subdirectory of A.")
        break

    selected_subdir = random.choice(subdirs)
    files = [f for f in os.listdir(selected_subdir) if os.path.isfile(os.path.join(selected_subdir, f))]
    selected_files = files[:files_per_batch]

    for f in selected_files:
        src_path = os.path.join(selected_subdir, f)
        # Update B folder if it reached 500 files
        if current_b_folder_file_count >= max_files_per_folder:
            current_b_folder_index += 1
            current_b_folder_file_count = 0
            file_index = 1
            current_b_folder_path = os.path.join(B, str(current_b_folder_index))
            os.makedirs(current_b_folder_path, exist_ok=True)

        # Rename to 1.jpg, 2.jpg, ...
        dst_filename = f"{file_index}.jpg"
        dst_path = os.path.join(current_b_folder_path, dst_filename)

        shutil.move(src_path, dst_path)
        file_index += 1
        current_b_folder_file_count += 1
