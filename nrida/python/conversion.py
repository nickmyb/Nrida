class Java2Python:
    def byte_array(java_byte_array):
        return [x + 256 if x < 0 else x for x in java_byte_array]


class Python:
    def byte_array_2_hex(python_byte_array):
        return ''.join('{:02x}'.format(b) for b in python_byte_array)
