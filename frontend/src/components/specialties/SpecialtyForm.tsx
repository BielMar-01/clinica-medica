import {
  useState,
  type FormEvent,
} from 'react'

import type {
  SpecialtyFormData,
} from '../../types/specialty'

const emptyForm:
  SpecialtyFormData = {
    nome: '',
    descricao: '',
  }

type SpecialtyFormProps = {
  open: boolean

  title: string

  initialData?:
    SpecialtyFormData | null

  submitting: boolean

  onClose: () => void

  onSubmit: (
    data:
      SpecialtyFormData,
  ) => Promise<void>
}

export function SpecialtyForm({
  open,
  title,
  initialData,
  submitting,
  onClose,
  onSubmit,
}: SpecialtyFormProps) {
  const [
    form,
    setForm,
  ] =
    useState<
      SpecialtyFormData
    >(
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

  function updateField(
    field:
      keyof SpecialtyFormData,

    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,

        [field]:
          value,
      }),
    )

    if (error) {
      setError('')
    }
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    try {
      setError('')

      await onSubmit(
        form,
      )
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar especialidade',
      )
    }
  }

  return (
    <div
      className="modal-backdrop"
      data-testid="specialty-form-modal-backdrop"
    >
      <div
        className="patient-modal"
        data-testid="specialty-form-modal"
      >
        <div
          className="modal-header"
          data-testid="specialty-form-header"
        >
          <div>
            <h2
              data-testid="specialty-form-title"
            >
              {title}
            </h2>

            <p
              data-testid="specialty-form-description"
            >
              Preencha os dados da
              especialidade.
            </p>
          </div>

          <button
            data-testid="specialty-form-close-button"
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={
              submitting
            }
            aria-label="Fechar formulário"
          >
            ×
          </button>
        </div>

        <form
          className="patient-form"
          data-testid="specialty-form"
          onSubmit={
            handleSubmit
          }
        >
          <div
            className="form-grid"
            data-testid="specialty-form-fields"
          >
            <label
              className="full-field"
            >
              Nome

              <input
                data-testid="specialty-name-input"
                value={
                  form.nome
                }
                onChange={(
                  event,
                ) =>
                  updateField(
                    'nome',
                    event
                      .target
                      .value,
                  )
                }
                required
                maxLength={120}
              />
            </label>

            <label
              className="full-field"
            >
              Descrição

              <textarea
                data-testid="specialty-description-input"
                value={
                  form.descricao
                }
                rows={4}
                maxLength={500}
                onChange={(
                  event,
                ) =>
                  updateField(
                    'descricao',
                    event
                      .target
                      .value,
                  )
                }
              />
            </label>
          </div>

          {error && (
            <div
              className="form-error"
              role="alert"
              data-testid="specialty-form-error-message"
            >
              {error}
            </div>
          )}

          <div
            className="modal-actions"
            data-testid="specialty-form-actions"
          >
            <button
              data-testid="specialty-form-cancel-button"
              type="button"
              className="secondary-button"
              onClick={
                onClose
              }
              disabled={
                submitting
              }
            >
              Cancelar
            </button>

            <button
              data-testid="specialty-form-submit-button"
              type="submit"
              disabled={
                submitting
              }
            >
              {submitting
                ? 'Salvando...'
                : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}