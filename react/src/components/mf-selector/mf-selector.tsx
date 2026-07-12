import { FC, useEffect, useMemo, useState } from 'react';
import styles from './mf-selector.module.scss';
import { ComponentTheme } from '../../themes/enums';
import { InputTheme } from '../../themes/interfaces';
import { profileAndHealthInputTheme } from '../../themes/profileHealth';
import { dietInputTheme } from '../../themes/diet';
import { workoutInputTheme } from '../../themes/workout';
import { Option } from '../../models/option';

type SelectorValue = string | number | Array<string | number>;

interface MFSelectorProps {
  label?: string;
  theme?: ComponentTheme;
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
  label = 'Select',
  theme = ComponentTheme.profileAndHealth,
  options,
  value,
  defaultValue = [],
  disabled = false,
  multiple = false,
  onChange,
}) => {
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>(() => normalizeValues(defaultValue));

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(normalizeValues(value));
    }
  }, [value]);

  const inputTheme: InputTheme = useMemo(() => {
    switch (theme) {
      case ComponentTheme.diet:
        return dietInputTheme;
      case ComponentTheme.workout:
        return workoutInputTheme;
      default:
        return profileAndHealthInputTheme;
    }
  }, [theme]);

  const toggleOption = (optionValue: string | number) => {
    const nextValues = multiple
      ? (selectedValues.includes(optionValue)
        ? selectedValues.filter((selectedValue) => selectedValue !== optionValue)
        : [...selectedValues, optionValue])
      : [optionValue];

    setSelectedValues(nextValues);
    onChange?.(multiple ? nextValues : nextValues[0] ?? '');
  };

  return (
    <div
      className={styles.selectorContainer}
      style={{
        borderColor: disabled ? 'transparent' : inputTheme.borderColor,
        backgroundColor: inputTheme.backgroundColor,
        color: inputTheme.textColor,
        opacity: disabled ? 0.75 : 1,
        pointerEvents: disabled ? 'none' : 'all',
      }}
    >
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.optionGroup}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              className={`${styles.option} ${isSelected ? styles.selected : ''}`}
              onClick={() => toggleOption(option.value)}
              style={{
                borderColor: inputTheme.borderColor,
                backgroundColor: isSelected ? inputTheme.borderColor : 'transparent',
                color: isSelected ? inputTheme.backgroundColor : inputTheme.textColor,
              }}
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
