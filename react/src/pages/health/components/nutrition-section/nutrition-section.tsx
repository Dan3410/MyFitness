import { FC } from 'react';
import { User } from '../../../../models/user';
import { PHYSICALACTIVITYLVL } from '../../../../models/physical-activity';
import MFTooltip from '../../../../components/mf-tooltip/mf-tooltip';



interface NutritionSectionProps {
  form: User
}

const NutritionSection: FC<NutritionSectionProps> = ({ form }) => {

  //TODO: AGREGAR TOOLTIPS INDICANDO PARA QUE SIRVE CADA COSA
  //CARBOS: INDICAR EL RANGO Y QUE SEGÚN OBJETIVO EN CUAL DEBE MANTENERSE, SI RANGO MINIMO O MAXIMO
  //GRASA: VER COMO SE CALCULA
  return (<>

    <h6>Nutrición</h6>
    <div>
      Estos valores son calculados en base a tu nivel de actividad física, objetivo y peso
    </div>
    <div>
      Calorias: 
    </div>
    <div>
      Proteinas <MFTooltip>contenido</MFTooltip>: Entre {
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
