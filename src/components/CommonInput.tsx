import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { useController, Control, RegisterOptions } from 'react-hook-form';

interface CommonInputProps extends TextInputProps {
  name: string;
  label?: string;
  control: Control<any>;
  rules?: RegisterOptions;
  multiline?: boolean;
}

const CommonInput: React.FC<CommonInputProps> = ({
  name,
  label,
  control,
  rules,
  multiline = false,
  ...rest
}) => {
  const {
    field: { onChange, onBlur, value },
    fieldState: { error },
  } = useController({ name, control, rules });

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, multiline && styles.multiline]}
        onChangeText={onChange}
        onBlur={onBlur}
        value={value}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        {...rest}
      />
      {error && <Text style={styles.error}>{error.message}</Text>}
    </View>
  );
};

export default CommonInput;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    borderWidth:1,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  multiline: {
    height: 100,
  },
  error: {
    marginTop: 4,
    color: 'red',
    fontSize: 12,
  },
});
