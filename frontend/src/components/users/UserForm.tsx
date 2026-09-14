import {
  useState,
  type FormEvent,
} from 'react'

import type {
  UserFormData,
} from '../../types/user'

type UserFormProps = {
  open: boolean
  title: string
  description: string

  initialData?:
    UserFormData | null

  submitting: boolean

  submitLabel: string

  onClose: () => void

  onSubmit: (
    data: UserFormData,
  ) => Promise<void>
}

const emptyForm:
  UserFormData = {
    nome: '',
    email: '',
    perfil:
      'RECEPCIONISTA',
  }

export function UserForm({
  open,
  title,
  description,
  initialData,
  submitting,
  submitLabel,
  onClose,
  onSubmit,
}: UserFormProps) {
  const [
    formData,
    setFormData,
  ] =
    useState<UserFormData>(
      initialData ??
        emptyForm,
    )

  const [
    error,
    setError,
  ] =
    useState('')

  if (!open) {
    return null
  }

  function handleClose() {
    if (submitting) {
      return
    }

    onClose()
  }

  function clearError() {
    if (error) {
      setError('')
    }
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const normalizedName =
      formData.nome.trim()

    const normalizedEmail =
      formData.email
        .trim()
        .toLowerCase()

    if (
      normalizedName.length <
      2
    ) {
      setError(
        'Informe o nome do usuário.',
      )

      return
    }

    if (!normalizedEmail) {
      setError(
        'Informe o e-mail do usuário.',
      )

      return
    }

    try {
      setError('')

      await onSubmit({
        ...formData,

        nome:
          normalizedName,

        email:
          normalizedEmail,
      })
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar usuário',
      )
    }
  }

  return (
    <div
      className="modal-backdrop"
      data-testid="user-form-backdrop"
      onMouseDown={(
        event,
      ) => {
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
        aria-labelledby="user-form-title"
        data-testid="user-form-modal"
      >
        <header
          className="modal-header"
          data-testid="user-form-header"
        >
          <div>
            <h2
              id="user-form-title"
              data-testid="user-form-title"
            >
              {title}
            </h2>

            <p
              data-testid="user-form-description"
            >
              {description}
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            aria-label="Fechar"
            disabled={
              submitting
            }
            onClick={
              handleClose
            }
            data-testid="user-form-close-button"
          >
            ×
          </button>
        </header>

        <form
          className="patient-form"
          onSubmit={
            handleSubmit
          }
          data-testid="user-form"
        >
          <p
            className="required-fields-hint"
            data-testid="user-form-required-fields-hint"
          >
            Campos marcados com{' '}
            <span
              className="required-field-mark"
            >
              *
            </span>{' '}
            são obrigatórios.
          </p>

          <div
            className="form-grid"
          >
            <label
              className="full-field"
            >
              <span>
                Nome{' '}

                <span
                  className="required-field-mark"
                >
                  *
                </span>
              </span>

              <input
                type="text"
                value={
                  formData.nome
                }
                onChange={(
                  event,
                ) => {
                  setFormData(
                    (
                      current,
                    ) => ({
                      ...current,

                      nome:
                        event
                          .target
                          .value,
                    }),
                  )

                  clearError()
                }}
                maxLength={150}
                placeholder="Nome completo"
                autoComplete="name"
                disabled={
                  submitting
                }
                required
                data-testid="user-form-name-input"
              />
            </label>

            <label
              className="full-field"
            >
              <span>
                E-mail{' '}

                <span
                  className="required-field-mark"
                >
                  *
                </span>
              </span>

              <input
                type="email"
                value={
                  formData.email
                }
                onChange={(
                  event,
                ) => {
                  setFormData(
                    (
                      current,
                    ) => ({
                      ...current,

                      email:
                        event
                          .target
                          .value,
                    }),
                  )

                  clearError()
                }}
                maxLength={180}
                placeholder="usuario@clinica.com"
                autoComplete="email"
                disabled={
                  submitting
                }
                required
                data-testid="user-form-email-input"
              />
            </label>

            <label
              className="full-field"
            >
              <span>
                Perfil{' '}

                <span
                  className="required-field-mark"
                >
                  *
                </span>
              </span>

              <select
                value={
                  formData.perfil
                }
                onChange={(
                  event,
                ) => {
                  setFormData(
                    (
                      current,
                    ) => ({
                      ...current,

                      perfil:
                        event
                          .target
                          .value as
                          UserFormData['perfil'],
                    }),
                  )

                  clearError()
                }}
                disabled={
                  submitting
                }
                required
                data-testid="user-form-role-select"
              >
                <option
                  value="RECEPCIONISTA"
                >
                  Recepcionista
                </option>

                <option
                  value="MEDICO"
                >
                  Médico
                </option>

                <option
                  value="ADMIN"
                >
                  Administrador
                </option>
              </select>
            </label>
          </div>

          {error && (
            <div
              className="form-error"
              role="alert"
              data-testid="user-form-error-message"
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
              disabled={
                submitting
              }
              onClick={
                handleClose
              }
              data-testid="user-form-cancel-button"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                submitting
              }
              data-testid="user-form-submit-button"
            >
              {submitting
                ? 'Salvando...'
                : submitLabel}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}