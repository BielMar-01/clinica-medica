import {
  useState,
  type FormEvent,
} from 'react'

import type {
  DoctorFormData,
} from '../../types/doctor'

import type {
  SpecialtySummary,
} from '../../types/specialty'

import type {
  UserSummary,
} from '../../types/user'

type DoctorFormMode =
  | 'create'
  | 'edit'

type DoctorFormProps = {
  open: boolean
  mode: DoctorFormMode
  initialData?: DoctorFormData | null
  users: UserSummary[]
  specialties: SpecialtySummary[]
  loadingUsers: boolean
  submitting: boolean
  onClose: () => void

  onSubmit: (
    data: DoctorFormData,
  ) => Promise<void>
}

const emptyForm:
  DoctorFormData = {
    usuarioId: '',
    nomeCompleto: '',
    crmNumero: '',
    crmUf: '',
    telefone: null,
    email: null,
    duracaoConsultaMinutos: 30,
    especialidades: [],
  }

export function DoctorForm({
  open,
  mode,
  initialData,
  users,
  specialties,
  loadingUsers,
  submitting,
  onClose,
  onSubmit,
}: DoctorFormProps) {
  const [
    formData,
    setFormData,
  ] =
    useState<DoctorFormData>(
      initialData ?? emptyForm,
    )

  const [
    error,
    setError,
  ] = useState('')

  if (!open) {
    return null
  }

  const editing =
    mode === 'edit'

  function clearError() {
    if (error) {
      setError('')
    }
  }

  function handleClose() {
    if (submitting) {
      return
    }

    onClose()
  }

  function handleUserChange(
    userId: string,
  ) {
    const selectedUser =
      users.find(
        (user) =>
          user.id === userId,
      )

    setFormData(
      (current) => ({
        ...current,

        usuarioId: userId,

        nomeCompleto:
          selectedUser?.nome ??
          current.nomeCompleto,

        email:
          selectedUser?.email ??
          current.email,
      }),
    )

    clearError()
  }

  function handleSpecialtyChange(
    specialtyId: string,
    checked: boolean,
  ) {
    setFormData(
      (current) => {
        if (checked) {
          const alreadySelected =
            current.especialidades.some(
              (specialty) =>
                specialty
                  .especialidadeId ===
                specialtyId,
            )

          if (alreadySelected) {
            return current
          }

          const hasMainSpecialty =
            current.especialidades.some(
              (specialty) =>
                specialty.principal,
            )

          return {
            ...current,

            especialidades: [
              ...current.especialidades,
              {
                especialidadeId:
                  specialtyId,

                principal:
                  !hasMainSpecialty,
              },
            ],
          }
        }

        const removedSpecialty =
          current.especialidades.find(
            (specialty) =>
              specialty
                .especialidadeId ===
              specialtyId,
          )

        const remainingSpecialties =
          current.especialidades.filter(
            (specialty) =>
              specialty
                .especialidadeId !==
              specialtyId,
          )

        if (
          removedSpecialty?.principal &&
          remainingSpecialties.length >
            0
        ) {
          return {
            ...current,

            especialidades:
              remainingSpecialties.map(
                (
                  specialty,
                  index,
                ) => ({
                  ...specialty,

                  principal:
                    index === 0,
                }),
              ),
          }
        }

        return {
          ...current,

          especialidades:
            remainingSpecialties,
        }
      },
    )

    clearError()
  }

  function handleMainSpecialtyChange(
    specialtyId: string,
  ) {
    setFormData(
      (current) => ({
        ...current,

        especialidades:
          current.especialidades.map(
            (specialty) => ({
              ...specialty,

              principal:
                specialty
                  .especialidadeId ===
                specialtyId,
            }),
          ),
      }),
    )

    clearError()
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const normalizedName =
      formData.nomeCompleto.trim()

    const normalizedCrm =
      formData.crmNumero.trim()

    const normalizedUf =
      formData.crmUf
        .trim()
        .toUpperCase()

    const normalizedPhone =
      formData.telefone?.trim() ||
      null

    const normalizedEmail =
      formData.email
        ?.trim()
        .toLowerCase() ||
      null

    if (!formData.usuarioId) {
      setError(
        'Selecione o usuário do médico.',
      )

      return
    }

    if (
      normalizedName.length < 2
    ) {
      setError(
        'Informe o nome completo do médico.',
      )

      return
    }

    if (!normalizedCrm) {
      setError(
        'Informe o CRM do médico.',
      )

      return
    }

    if (
      normalizedUf.length !== 2
    ) {
      setError(
        'Informe a UF do CRM.',
      )

      return
    }

    if (
      formData
        .duracaoConsultaMinutos <
        5 ||
      formData
        .duracaoConsultaMinutos >
        480
    ) {
      setError(
        'A duração da consulta deve estar entre 5 e 480 minutos.',
      )

      return
    }

    if (
      formData.especialidades
        .length === 0
    ) {
      setError(
        'Selecione pelo menos uma especialidade.',
      )

      return
    }

    const specialtyIds =
      formData.especialidades.map(
        (specialty) =>
          specialty.especialidadeId,
      )

    if (
      new Set(
        specialtyIds,
      ).size !==
      specialtyIds.length
    ) {
      setError(
        'Não é permitido selecionar a mesma especialidade mais de uma vez.',
      )

      return
    }

    const mainSpecialties =
      formData.especialidades.filter(
        (specialty) =>
          specialty.principal,
      )

    if (
      mainSpecialties.length !== 1
    ) {
      setError(
        'Defina exatamente uma especialidade principal.',
      )

      return
    }

    try {
      setError('')

      await onSubmit({
        ...formData,

        nomeCompleto:
          normalizedName,

        crmNumero:
          normalizedCrm,

        crmUf:
          normalizedUf,

        telefone:
          normalizedPhone,

        email:
          normalizedEmail,
      })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : editing
            ? 'Erro ao atualizar médico'
            : 'Erro ao cadastrar médico',
      )
    }
  }

  return (
    <div
      className="modal-backdrop"
      data-testid="doctor-form-backdrop"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose()
        }
      }}
    >
      <section
        className="patient-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-form-title"
        data-testid="doctor-form-modal"
      >
        <header
          className="modal-header"
          data-testid="doctor-form-header"
        >
          <div>
            <h2
              id="doctor-form-title"
              data-testid="doctor-form-title"
            >
              {editing
                ? 'Editar médico'
                : 'Novo médico'}
            </h2>

            <p
              data-testid="doctor-form-description"
            >
              {editing
                ? 'Atualize os dados profissionais do médico.'
                : 'Vincule um usuário médico e informe os dados profissionais.'}
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            aria-label="Fechar"
            disabled={submitting}
            onClick={handleClose}
            data-testid="doctor-form-close-button"
          >
            ×
          </button>
        </header>

        <form
          className="patient-form"
          onSubmit={handleSubmit}
          data-testid="doctor-form"
        >
          <p
            className="required-fields-hint"
            data-testid="doctor-form-required-fields-hint"
          >
            Campos marcados com{' '}
            <span
              className="required-field-mark"
            >
              *
            </span>{' '}
            são obrigatórios.
          </p>

          <div className="form-grid">
            <label
              className="full-field"
            >
              <span>
                Usuário{' '}

                <span
                  className="required-field-mark"
                >
                  *
                </span>
              </span>

              <select
                value={
                  formData.usuarioId
                }
                onChange={(event) =>
                  handleUserChange(
                    event.target.value,
                  )
                }
                disabled={
                  submitting ||
                  loadingUsers ||
                  editing
                }
                required
                data-testid="doctor-user-select"
              >
                <option value="">
                  {loadingUsers
                    ? 'Carregando usuários...'
                    : 'Selecione o usuário'}
                </option>

                {users.map(
                  (systemUser) => (
                    <option
                      key={
                        systemUser.id
                      }
                      value={
                        systemUser.id
                      }
                    >
                      {
                        systemUser.nome
                      }{' '}
                      —{' '}
                      {
                        systemUser.email
                      }
                    </option>
                  ),
                )}
              </select>
            </label>

            {!editing &&
              users.length === 0 &&
              !loadingUsers && (
                <div
                  className="form-error full-field"
                  data-testid="doctor-users-empty-message"
                >
                  Nenhum usuário com perfil Médico está disponível para vínculo.
                </div>
              )}

            <label
              className="full-field"
            >
              <span>
                Nome completo{' '}

                <span
                  className="required-field-mark"
                >
                  *
                </span>
              </span>

              <input
                type="text"
                value={
                  formData.nomeCompleto
                }
                onChange={(event) => {
                  setFormData(
                    (current) => ({
                      ...current,

                      nomeCompleto:
                        event.target
                          .value,
                    }),
                  )

                  clearError()
                }}
                maxLength={180}
                disabled={submitting}
                required
                data-testid="doctor-name-input"
              />
            </label>

            <label>
              <span>
                CRM{' '}

                <span
                  className="required-field-mark"
                >
                  *
                </span>
              </span>

              <input
                type="text"
                value={
                  formData.crmNumero
                }
                onChange={(event) => {
                  setFormData(
                    (current) => ({
                      ...current,

                      crmNumero:
                        event.target
                          .value,
                    }),
                  )

                  clearError()
                }}
                maxLength={20}
                disabled={submitting}
                required
                data-testid="doctor-crm-input"
              />
            </label>

            <label>
              <span>
                UF do CRM{' '}

                <span
                  className="required-field-mark"
                >
                  *
                </span>
              </span>

              <input
                type="text"
                value={
                  formData.crmUf
                }
                maxLength={2}
                placeholder="SP"
                onChange={(event) => {
                  setFormData(
                    (current) => ({
                      ...current,

                      crmUf:
                        event.target
                          .value
                          .toUpperCase(),
                    }),
                  )

                  clearError()
                }}
                disabled={submitting}
                required
                data-testid="doctor-crm-uf-input"
              />
            </label>

            <label>
              Telefone

              <input
                type="text"
                value={
                  formData.telefone ??
                  ''
                }
                onChange={(event) => {
                  setFormData(
                    (current) => ({
                      ...current,

                      telefone:
                        event.target
                          .value,
                    }),
                  )

                  clearError()
                }}
                maxLength={20}
                disabled={submitting}
                data-testid="doctor-phone-input"
              />
            </label>

            <label>
              E-mail

              <input
                type="email"
                value={
                  formData.email ??
                  ''
                }
                onChange={(event) => {
                  setFormData(
                    (current) => ({
                      ...current,

                      email:
                        event.target
                          .value,
                    }),
                  )

                  clearError()
                }}
                maxLength={180}
                disabled={submitting}
                data-testid="doctor-email-input"
              />
            </label>

            <label>
              <span>
                Duração da consulta{' '}

                <span
                  className="required-field-mark"
                >
                  *
                </span>
              </span>

              <input
                type="number"
                min={5}
                max={480}
                step={5}
                value={
                  formData
                    .duracaoConsultaMinutos
                }
                onChange={(event) => {
                  setFormData(
                    (current) => ({
                      ...current,

                      duracaoConsultaMinutos:
                        Number(
                          event.target
                            .value,
                        ),
                    }),
                  )

                  clearError()
                }}
                disabled={submitting}
                required
                data-testid="doctor-duration-input"
              />
            </label>
          </div>

          <div
            data-testid="doctor-specialties-section"
          >
            <h3>
              Especialidades{' '}

              <span
                className="required-field-mark"
              >
                *
              </span>
            </h3>

            <p>
              Selecione uma ou mais especialidades e defina uma como principal.
            </p>

            {specialties.length ===
              0 && (
              <div
                className="form-error"
                data-testid="doctor-specialties-empty"
              >
                Nenhuma especialidade ativa disponível.
              </div>
            )}

            {specialties.map(
              (specialty) => {
                const selected =
                  formData.especialidades
                    .some(
                      (item) =>
                        item
                          .especialidadeId ===
                        specialty.id,
                    )

                const main =
                  formData.especialidades
                    .some(
                      (item) =>
                        item
                          .especialidadeId ===
                          specialty.id &&
                        item.principal,
                    )

                return (
                  <div
                    key={
                      specialty.id
                    }
                    data-testid={`doctor-specialty-row-${specialty.id}`}
                  >
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          selected
                        }
                        disabled={
                          submitting
                        }
                        onChange={(
                          event,
                        ) =>
                          handleSpecialtyChange(
                            specialty.id,
                            event.target
                              .checked,
                          )
                        }
                        data-testid={`doctor-specialty-${specialty.id}`}
                      />

                      {specialty.nome}
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="doctor-main-specialty"
                        checked={main}
                        disabled={
                          submitting ||
                          !selected
                        }
                        onChange={() =>
                          handleMainSpecialtyChange(
                            specialty.id,
                          )
                        }
                        data-testid={`doctor-main-specialty-${specialty.id}`}
                      />

                      Principal
                    </label>
                  </div>
                )
              },
            )}
          </div>

          {error && (
            <div
              className="form-error"
              role="alert"
              data-testid="doctor-form-error-message"
            >
              {error}
            </div>
          )}

          <div
            className="modal-actions"
          >
            <button
              type="button"
              className="secondary-button"
              disabled={submitting}
              onClick={handleClose}
              data-testid="doctor-form-cancel-button"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                submitting ||
                loadingUsers ||
                (!editing &&
                  users.length === 0) ||
                specialties.length ===
                  0
              }
              data-testid="doctor-form-submit-button"
            >
              {submitting
                ? 'Salvando...'
                : editing
                  ? 'Salvar alterações'
                  : 'Cadastrar médico'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}