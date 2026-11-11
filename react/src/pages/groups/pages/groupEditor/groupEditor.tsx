import { useEffect, useState, type DragEvent, type FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import defaultProfileImage from '../../../../assets/defaultProfileImage.jpg';
import MFButton from '../../../../components/mf-button/mf-button';
import MFFormField from '../../../../components/mf-form-field/mf-form-field';
import MFSpinner from '../../../../components/mf-spinner/mf-spinner';
import MFBreadcrumb from '../../../../components/mf-breadcrumb/mf-breadcrumb';
import type { UserSearchResult } from '../../../../models/user';
import type { StudentGroup } from '../../../../models/studentGroup';
import { profileService } from '../../../../services/profileService';
import { studentGroupsService } from '../../../../services/studentGroupsService';
import { trainerStudentService } from '../../../../services/trainerStudentService';
import styles from './groupEditor.module.scss';

const GroupEditor: FC = () => {
  const { groupId } = useParams();
  const isNew = !groupId || groupId === 'new';
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [students, setStudents] = useState<UserSearchResult[]>([]);
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const loadEditor = async () => {
      try {
        const [profile, linkedStudents, group] = await Promise.all([
          profileService.getUserData(),
          trainerStudentService.getStudents(),
          isNew ? Promise.resolve(null) : studentGroupsService.getGroup(groupId),
        ]);
        if (!active) return;
        if (!profile.isTrainer || (group && !group.administrator)) {
          setError('Solo el administrador del grupo puede editarlo.');
          return;
        }
        setStudents(linkedStudents);
        if (group) {
          setName(group.name);
          setMemberIds(group.members
            .filter((member) => member.id !== group.trainerId)
            .map((member) => member.id));
        }
      } catch {
        if (active) setError('No se pudo cargar el grupo y sus alumnos.');
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadEditor();
    return () => { active = false; };
  }, [groupId, isNew]);

  const moveStudent = (studentId: string, addToGroup: boolean) => {
    setMemberIds((current) => addToGroup
      ? current.includes(studentId) ? current : [...current, studentId]
      : current.filter((id) => id !== studentId));
  };

  const handleDrop = (event: DragEvent<HTMLElement>, addToGroup: boolean) => {
    event.preventDefault();
    const studentId = event.dataTransfer.getData('text/plain');
    if (studentId) moveStudent(studentId, addToGroup);
  };

  const save = async () => {
    if (!name.trim()) {
      setError('El nombre del grupo es obligatorio.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const group: StudentGroup = isNew
        ? await studentGroupsService.createGroup(name.trim(), memberIds)
        : await studentGroupsService.updateGroup(groupId!, name.trim(), memberIds);
      navigate(`/groups/${encodeURIComponent(group.id)}`);
    } catch {
      setError('No se pudo guardar el grupo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <MFSpinner theme="primary" />;

  const availableStudents = students.filter((student) => !memberIds.includes(student.id));
  const members = students.filter((student) => memberIds.includes(student.id));

  return (
    <main className={styles.GroupEditor}>
      <div className="PageHeader">
        <MFBreadcrumb items={[
          { label: 'Inicio', to: '/' },
          { label: 'Grupos', to: '/groups' },
          { label: isNew ? 'Nuevo grupo' : 'Editar grupo' },
        ]} />
        <h2>{isNew ? 'Nuevo grupo' : 'Editar grupo'}</h2>
      </div>
      {error && <p role="alert">{error}</p>}
      <MFFormField theme="primary">
        <label htmlFor="group-name">Nombre del grupo</label>
        <input
          id="group-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </MFFormField>
      <div className={styles.GroupEditor__Lists}>
        <section
          className={styles.GroupEditor__List}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDrop(event, false)}
          aria-label="Alumnos disponibles"
        >
          <h2>Alumnos disponibles</h2>
          <div className={styles.GroupEditor__ListItems}>
            {availableStudents.map((student) => (
              <div
                className={styles.GroupEditor__Student}
                key={student.id}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('text/plain', student.id)}
              >
                <span className={styles.GroupEditor__StudentProfile}>
                  <img src={student.profileImage || defaultProfileImage} alt="" />
                  <span>{student.name}</span>
                </span>
                <MFButton type="button" onClickEvent={() => moveStudent(student.id, true)}>Agregar</MFButton>
              </div>
            ))}
            {availableStudents.length === 0 && <p>No hay alumnos disponibles.</p>}
          </div>
        </section>
        <section
          className={styles.GroupEditor__List}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => handleDrop(event, true)}
          aria-label="Miembros del grupo"
        >
          <h2>Miembros del grupo</h2>
          <div className={styles.GroupEditor__ListItems}>
            {members.map((student) => (
              <div
                className={styles.GroupEditor__Student}
                key={student.id}
                draggable
                onDragStart={(event) => event.dataTransfer.setData('text/plain', student.id)}
              >
                <span className={styles.GroupEditor__StudentProfile}>
                  <img src={student.profileImage || defaultProfileImage} alt="" />
                  <span>{student.name}</span>
                </span>
                <MFButton type="button" onClickEvent={() => moveStudent(student.id, false)}>Quitar</MFButton>
              </div>
            ))}
            {members.length === 0 && <p>Arrastra alumnos aquí para agregarlos.</p>}
          </div>
        </section>
      </div>
      <div className={styles.GroupEditor__Actions}>
        <MFButton type="button" onClickEvent={() => navigate('/groups')}>Cancelar</MFButton>
        <MFButton theme="primary" type="button" isDisabled={saving} onClickEvent={() => void save()}>
          {saving ? 'Guardando...' : 'Guardar'}
        </MFButton>
      </div>
    </main>
  );
};

export default GroupEditor;
