import { FC } from 'react';
import styles from './nutrition-section.module.scss'
import { User } from '../../../../models/user';
import { PHYSICALACTIVITYLVL } from '../../../../models/physical-activity';



interface NutritionSectionProps {
  form: User
}

const NutritionSection: FC<NutritionSectionProps> = ({ form }) => {

  return (<>

    <h6>Nutrición</h6>
    <div>
      Estos valores son calculados en base a tu nivel de actividad física, objetivo y peso
    </div>
    <div>
      Calorias: 
    </div>
    <div>
      Proteinas: Entre {
        (form.physicalActivityLvl == PHYSICALACTIVITYLVL.LOW || PHYSICALACTIVITYLVL.NONE ? 0.8
          : form.physicalActivityLvl == PHYSICALACTIVITYLVL.MEDIUM ? 1.2 : 1.6) * Number(form.weight)
      } - {
        (form.physicalActivityLvl == PHYSICALACTIVITYLVL.LOW || PHYSICALACTIVITYLVL.NONE ? 1.2
          : form.physicalActivityLvl == PHYSICALACTIVITYLVL.MEDIUM ? 1.6 : 2.2) * Number(form.weight)}
    </div>
    <div>
      Carbohidratos:
    </div>
    <div>
      Grasas:
    </div>

  </>
  )
};

export default NutritionSection;
