import { FC } from 'react';
import { User } from '../../../../models/user';
import { PHYSICALACTIVITYLVL } from '../../../../models/physical-activity';
import MFTooltip from '../../../../components/mf-tooltip/mf-tooltip';
import { ComponentTheme } from '../../../../themes/enums';
import { OBJETIVE } from '../../../../models/objetive';
import { WEIGHTUNIT } from '../../../../models/weightUnit';



interface NutritionSectionProps {
  form: User
}

const NutritionSection: FC<NutritionSectionProps> = ({ form }) => {

  const getMinimumCalories = () => {
    return getMinimumCarbohidrates() * 4 + getMinimumProtein() * 4 + getMinimumFats() * 9
  }

  const getMaximumCalories = () => {
    return getMaximumCarbohidrates() * 4 + getMaximumProtein() * 4 + getMaximumFats() * 9
  }

  const getWeightInKg = () => {
    if(!form.weight || form.weight < 0)
      return 0
    if(form.weightUnit == WEIGHTUNIT.LB)
      return form.weight * 0.453592
    return form.weight
  }

  const getMinimumProtein = () => {
    return Math.round((form.physicalActivityLvl == PHYSICALACTIVITYLVL.LOW || form.physicalActivityLvl == PHYSICALACTIVITYLVL.NONE ? 0.8
      : form.physicalActivityLvl == PHYSICALACTIVITYLVL.MEDIUM ? 1.2 : 1.6) * Number(getWeightInKg()))
  }

  const getMaximumProtein = () => {
    return Math.round((form.physicalActivityLvl == PHYSICALACTIVITYLVL.LOW || form.physicalActivityLvl == PHYSICALACTIVITYLVL.NONE ? 1.2
      : form.physicalActivityLvl == PHYSICALACTIVITYLVL.MEDIUM ? 1.6 : 2.2) * Number(getWeightInKg()))
  }

  const getMinimumCarbohidrates = () => {
    return Math.round((form.physicalActivityLvl == PHYSICALACTIVITYLVL.LOW || form.physicalActivityLvl == PHYSICALACTIVITYLVL.NONE ? 3
      : form.physicalActivityLvl == PHYSICALACTIVITYLVL.MEDIUM ? 5 : form.objetive == OBJETIVE.INCREASE ? 6.5 : 6) * Number(getWeightInKg()))
  }

  const getMaximumCarbohidrates = () => {
    return Math.round((form.physicalActivityLvl == PHYSICALACTIVITYLVL.LOW || form.physicalActivityLvl == PHYSICALACTIVITYLVL.NONE ? 5
      : form.physicalActivityLvl == PHYSICALACTIVITYLVL.MEDIUM ? 6.5 : form.objetive == OBJETIVE.INCREASE ? 7.5 : 7) * Number(getWeightInKg()))
  }

  const getMinimumFats = () => {
    return Math.round((form.objetive == OBJETIVE.REDUCE ? 0.5 : 1) * Number(getWeightInKg()))
  }

  const getMaximumFats = () => {
    return Math.round((form.objetive == OBJETIVE.REDUCE ? 1 : 1.2) * Number(getWeightInKg()))
  }

  return (<>

    <h6>Nutrición</h6>
    <div>
      Estos valores son calculados en base a tu nivel de actividad física, objetivo y peso
    </div>
    <div>
      Calorias <MFTooltip theme={ComponentTheme.profileAndHeath}>
        Unidad de energia obtenida de alimentos y gastadas en el día a día. El exceso se almacena. Cada item debajo aporta calorias:
        <ul>
          <li> Proteina: 4kcal/g</li>
          <li> Carbohidratos: 4kcal/g</li>
          <li> Grasa: 9kcal/g</li>
        </ul>
      </MFTooltip>: Entre {getMinimumCalories()}kcal - {getMaximumCalories()}kcal
    </div>
    <div>
      Proteinas
      <MFTooltip theme={ComponentTheme.profileAndHeath}>
        Fundamental para la reparación, construcción y fortalecimiento muscular. Consumir más de lo requerido no produce ningún beneficio y puede ser dañino a largo plazo.
      </MFTooltip>: Entre {getMinimumProtein()}g - {getMaximumProtein()}g
    </div>
    <div>
      Carbohidratos <MFTooltip theme={ComponentTheme.profileAndHeath}>
        Fuente principal de energía del ser humano. Si bien se necesita altas cantidades, se recomienda evitar que sean azucares.
      </MFTooltip>: Entre {getMinimumCarbohidrates()}g - {getMaximumCarbohidrates()}g
    </div>
    <div>
      Grasas <MFTooltip theme={ComponentTheme.profileAndHeath}>
        Ayudan a absorber vitaminas, formar hormonas y membranas y protegen los organos. Se recomienda consumir grasas saludables (insaturadas) ya que las insalubres (saturadas) aumentan el colesterol "malo".
      </MFTooltip>: Entre {getMinimumFats()}g - {getMaximumFats()}g
    </div>

  </>
  )
};

export default NutritionSection;
