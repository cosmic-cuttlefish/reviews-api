

def create_small_copy(file_path, file_name):
    with open(file_path + file_name, 'r') as file_in, open(file_path + 'small_' + file_name, 'w') as file_out:
        for i in range(1500):
            line = file_in.readline()
            file_out.write(line)