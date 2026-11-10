import { FC, useState } from 'react';
import styles from './mf-selector.module.scss';
import type { ColorVariant } from '../../models/colorVariant';
import { Option } from '../../models/option';

type SelectorValue = string | number | Array<string | number>;

interface MFSelectorProps {
  label?: string;
  theme: ColorVariant;
  options: Option[];
  value?: SelectorValue;
  defaultValue?: SelectorValue;
  disabled?: boolean;
  multiple?: boolean;
  onChange?: (value: SelectorValue) => void;
}

const normalizeValues = (value?: SelectorValue): (string | number)[] => {
  if (Array.isArray(value)) {
    return value;
  }

  return value ? [value] : [];
};

const MFSelector: FC<MFSelectorProps> = ({
  label = '',
  theme,
  options,
  value,
  defaultValue = [],
  disabled = false,
  multiple = false,
  onChange,
}) => {
  const [uncontrolledValues, setUncontrolledValues] = useState<(string | number)[]>(() => normalizeValues(defaultValue));
  const selectedValues = value === undefined ? uncontrolledValues : normalizeValues(value);

  const toggleOption = (optionValue: string | number) => {
    if (disabled) return;

    const nextValues = multiple
      ? (selectedValues.includes(optionValue)
        ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
        : [...selectedValues, optionValue])
      : [optionValue];

    if (value === undefined) setUncontrolledValues(nextValues);
    onChange?.(multiple ? nextValues : nextValues[0] ?? '');
  };

  return (
    <div
      className={`${styles.MFSelector} ${styles[`MFSelector--${theme.charAt(0).toUpperCase()}${theme.slice(1)}`]} ${disabled ? styles['MFSelector--Disabled'] : ''}`}
    >
      {label && <span className={styles.MFSelector__Label}>{label}</span>}
      <div className={styles.MFSelector__OptionGroup}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              disabled={disabled}
              className={`${styles.MFSelector__Option} ${isSelected ? styles['MFSelector__Option--Selected'] : ''}`}
              onClick={() => toggleOption(option.value)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MFSelector;
