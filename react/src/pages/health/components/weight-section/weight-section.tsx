import { ChangeEvent, FC, useEffect, useState } from 'react';
import { ComponentTheme } from '../../../../models/componentTheme';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import { CONST_WEIGHTUNIT_OPTIONS } from '../../../../const/weightUnitOptions';
import styles from './weight-section.module.scss'
import { User } from '../../../../models/user';
import { CONST_OBJETIVE_OPTIONS } from '../../../../const/objectiveOptions';
import MFError from '../../../../components/mf-error/mf-error';
import MFExpandablePanel from '../../../../components/mf-expandable-panel/mf-expandable-panel';
import { Option } from '../../../../models/option';
import { WEIGHTUNIT } from '../../../../models/weightUnit';
import { WeightHistoryPoint } from '../../../../models/weightHistory';
import { profileService } from '../../../../services/profileService';


interface WeightSectionProps {
  edit: boolean
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  form: User
  refreshWeightHistory: number
}

const WeightSection: FC<WeightSectionProps> = ({ handleChange, edit, form, refreshWeightHistory }) => {

  const weightUnit: Array<Option> = CONST_WEIGHTUNIT_OPTIONS
  const objective: Array<Option> = CONST_OBJETIVE_OPTIONS
  const [weightHistory, setWeightHistory] = useState<WeightHistoryPoint[]>([])

  useEffect(() => {
    profileService.getWeightHistory().then(setWeightHistory).catch(() => setWeightHistory([]))
  }, [refreshWeightHistory])

  const historyData = weightHistory.map(({ date, weight }, index) => ({
    date,
    day: index + 1,
    value: form.weightUnit === WEIGHTUNIT.KG ? weight : Math.round(weight * 2.20462 * 10) / 10,
  }))
  const chartMin = Math.floor(Math.min(...historyData.map(({ value }) => value)) - 0.5)
  const chartMax = Math.ceil(Math.max(...historyData.map(({ value }) => value)) + 0.5)
  const chartWidth = 720
  const chartHeight = 290
  const chartPadding = { top: 24, right: 20, bottom: 72, left: 48 }
  const chartInnerWidth = chartWidth - chartPadding.left - chartPadding.right
  const chartInnerHeight = chartHeight - chartPadding.top - chartPadding.bottom
  const dateLabelY = chartHeight - 40
  const dateLabelOffset = 8
  const chartPoints = historyData.map(({ day, value }) => ({
    x: chartPadding.left + ((day - 1) / (historyData.length - 1)) * chartInnerWidth,
    y: chartPadding.top + ((chartMax - value) / (chartMax - chartMin)) * chartInnerHeight,
  }))
  const linePath = chartPoints.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const chartGuides = [chartMax, chartMax - (chartMax - chartMin) / 2, chartMin]
  const formatHistoryDate = (date: string) => date.split('-').reverse().slice(0, 2).join('/')

  return (<>

    <MFExpandablePanel title="Peso" theme={ComponentTheme.profileAndHealth}>
      <div className={styles.profileFormSection}>
        <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
          <label>Unidad de medida del peso</label>
          <select name="weightUnit" value={form.weightUnit} onChange={handleChange}>
            {weightUnit.map((item: Option) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </MFFormField>
        <div>
          <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
            <label>Peso</label>
            <input name="weight" value={form.weight} onChange={handleChange}>
            </input>
          </MFFormField>
          <MFError hidden={!edit || !!form.weight}>Este campo es obligatorio</MFError>
          <MFError hidden={!edit || !!form.height && form.weight > 0}>El valor debe ser mayor a 0</MFError>
        </div>
        <MFFormField disabled={!edit} theme={ComponentTheme.profileAndHealth}>
          <label>Objetivo</label>
          <select name="objective" value={form.objective} onChange={handleChange}>
            {objective.map((item: Option) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </MFFormField>
      </div>
      <section className={styles.weightHistory} aria-labelledby="weight-history-title">
        <div className={styles.chartHeader}>
          <div>
            <h3 id="weight-history-title">Evolución del peso</h3>
            <p>Últimos 15 días</p>
          </div>
          <span className={styles.chartUnit}>{form.weightUnit}</span>
        </div>
        <div className={styles.chartContainer}>
          {historyData.length > 0 ? <svg
            className={styles.chart}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-label={`Evolución del peso durante los últimos 15 días en ${form.weightUnit}`}
          >
            {chartGuides.map((guide) => {
              const y = chartPadding.top + ((chartMax - guide) / (chartMax - chartMin)) * chartInnerHeight
              return (
                <g key={guide}>
                  <line className={styles.gridLine} x1={chartPadding.left} x2={chartWidth - chartPadding.right} y1={y} y2={y} />
                  <text className={styles.axisLabel} x={chartPadding.left - 10} y={y + 4} textAnchor="end">{guide.toFixed(1)}</text>
                </g>
              )
            })}
            <line className={styles.axisLine} x1={chartPadding.left} x2={chartPadding.left} y1={chartPadding.top} y2={chartHeight - chartPadding.bottom} />
            <line className={styles.axisLine} x1={chartPadding.left} x2={chartWidth - chartPadding.right} y1={chartHeight - chartPadding.bottom} y2={chartHeight - chartPadding.bottom} />
            <path className={styles.chartLine} d={linePath} />
            {chartPoints.map(({ x, y }, index) => (
              <circle className={styles.chartPoint} key={historyData[index].day} cx={x} cy={y} r="4" />
            ))}
            {chartPoints.map(({ x }, index) => (
              <text
                className={styles.axisLabel}
                key={historyData[index].day}
                x={x + dateLabelOffset}
                y={dateLabelY}
                textAnchor="end"
                transform={`rotate(-45 ${x + dateLabelOffset} ${dateLabelY})`}
              >
                {formatHistoryDate(historyData[index].date)}
              </text>
            ))}
          </svg> : <p className={styles.chartStatus}>Cargando evolución del peso...</p>}
        </div>
      </section>
    </MFExpandablePanel>
  </>
  )
};

export default WeightSection;
