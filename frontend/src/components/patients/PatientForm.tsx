import {
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import type {
  PatientFormData,
} from '../../types/patient'

const emptyForm: PatientFormData = {
  nomeCompleto: '',
  cpf: '',
  dataNascimento: '',
  sexo: '',
  telefone: '',
  telefoneSecundario: '',
  email: '',
  nomeMae: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  observacoes: '',
}

type PatientFormProps = {
  open: boolean

  title: string

  initialData?:
    PatientFormData | null

  submitting: boolean

  onClose: () => void

  onSubmit: (
    data: PatientFormData,
  ) => Promise<void>
}

export function PatientForm({
  open,
  title,
  initialData,
  submitting,
  onClose,
  onSubmit,
}: PatientFormProps) {
  const [
    form,
    setForm,
  ] =
    useState<PatientFormData>(
      emptyForm,
    )

  const [
    error,
    setError,
  ] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    setForm(
      initialData ??
        emptyForm,
    )

    setError('')
  }, [
    open,
    initialData,
  ])

  if (!open) {
    return null
  }

  function updateField(
    field:
      keyof PatientFormData,

    value: string,
  ) {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      }),
    )
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    try {
      setError('')

      await onSubmit(form)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Erro ao salvar paciente',
      )
    }
  }

  return (
    <div
      className="modal-backdrop"
      data-testid="patient-form-modal-backdrop"
    >
      <div
        className="patient-modal"
        data-testid="patient-form-modal"
      >
        <div
          className="modal-header"
          data-testid="patient-form-header"
        >
          <div>
            <h2 data-testid="patient-form-title">
              {title}
            </h2>

            <p data-testid="patient-form-description">
              Preencha os dados
              cadastrais do
              paciente.
            </p>
          </div>

          <button
            data-testid="patient-form-close-button"
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Fechar formulário"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="patient-form"
          data-testid="patient-form"
        >
          <div
            className="form-grid"
            data-testid="patient-form-fields"
          >
            <label className="full-field">
              Nome completo

              <input
                data-testid="patient-name-input"
                value={
                  form.nomeCompleto
                }
                onChange={(event) =>
                  updateField(
                    'nomeCompleto',
                    event.target.value,
                  )
                }
                required
              />
            </label>

            <label>
              CPF

              <input
                data-testid="patient-cpf-input"
                value={form.cpf}
                onChange={(event) =>
                  updateField(
                    'cpf',
                    event.target.value,
                  )
                }
                required
              />
            </label>

            <label>
              Data de nascimento

              <input
                data-testid="patient-birth-date-input"
                type="date"
                value={
                  form.dataNascimento
                }
                onChange={(event) =>
                  updateField(
                    'dataNascimento',
                    event.target.value,
                  )
                }
                required
              />
            </label>

            <label>
              Sexo

              <select
                data-testid="patient-sex-select"
                value={form.sexo}
                onChange={(event) =>
                  updateField(
                    'sexo',
                    event.target.value,
                  )
                }
              >
                <option value="">
                  Não informado
                </option>

                <option value="MASCULINO">
                  Masculino
                </option>

                <option value="FEMININO">
                  Feminino
                </option>

                <option value="OUTRO">
                  Outro
                </option>
              </select>
            </label>

            <label>
              Telefone

              <input
                data-testid="patient-phone-input"
                value={
                  form.telefone
                }
                onChange={(event) =>
                  updateField(
                    'telefone',
                    event.target.value,
                  )
                }
                required
              />
            </label>

            <label>
              Telefone secundário

              <input
                data-testid="patient-secondary-phone-input"
                value={
                  form.telefoneSecundario
                }
                onChange={(event) =>
                  updateField(
                    'telefoneSecundario',
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              E-mail

              <input
                data-testid="patient-email-input"
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    'email',
                    event.target.value,
                  )
                }
              />
            </label>

            <label className="full-field">
              Nome da mãe

              <input
                data-testid="patient-mother-name-input"
                value={
                  form.nomeMae
                }
                onChange={(event) =>
                  updateField(
                    'nomeMae',
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              CEP

              <input
                data-testid="patient-zip-code-input"
                value={form.cep}
                onChange={(event) =>
                  updateField(
                    'cep',
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              Estado

              <input
                data-testid="patient-state-input"
                value={
                  form.estado
                }
                maxLength={2}
                onChange={(event) =>
                  updateField(
                    'estado',
                    event.target.value
                      .toUpperCase(),
                  )
                }
              />
            </label>

            <label className="full-field">
              Logradouro

              <input
                data-testid="patient-address-input"
                value={
                  form.logradouro
                }
                onChange={(event) =>
                  updateField(
                    'logradouro',
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              Número

              <input
                data-testid="patient-address-number-input"
                value={
                  form.numero
                }
                onChange={(event) =>
                  updateField(
                    'numero',
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              Complemento

              <input
                data-testid="patient-address-complement-input"
                value={
                  form.complemento
                }
                onChange={(event) =>
                  updateField(
                    'complemento',
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              Bairro

              <input
                data-testid="patient-neighborhood-input"
                value={
                  form.bairro
                }
                onChange={(event) =>
                  updateField(
                    'bairro',
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              Cidade

              <input
                data-testid="patient-city-input"
                value={
                  form.cidade
                }
                onChange={(event) =>
                  updateField(
                    'cidade',
                    event.target.value,
                  )
                }
              />
            </label>

            <label className="full-field">
              Observações

              <textarea
                data-testid="patient-notes-input"
                value={
                  form.observacoes
                }
                rows={4}
                onChange={(event) =>
                  updateField(
                    'observacoes',
                    event.target.value,
                  )
                }
              />
            </label>
          </div>

          {error && (
            <div
              className="form-error"
              role="alert"
              data-testid="patient-form-error-message"
            >
              {error}
            </div>
          )}

          <div
            className="modal-actions"
            data-testid="patient-form-actions"
          >
            <button
              data-testid="patient-form-cancel-button"
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={
                submitting
              }
            >
              Cancelar
            </button>

            <button
              data-testid="patient-form-submit-button"
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