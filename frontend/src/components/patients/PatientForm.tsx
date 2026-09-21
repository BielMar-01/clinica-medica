import {
  useState,
  type FormEvent,
} from 'react'

import type {
  PatientFormData,
} from '../../types/patient'

const emptyForm:
  PatientFormData = {
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
    data:
      PatientFormData,
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
    useState<
      PatientFormData
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
      keyof PatientFormData,

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
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Erro ao salvar paciente',
      )
    }
  }

  return (
    <div
      className="modal-backdrop"
      data-testid="patient-form-modal-backdrop"
      role="presentation"
    >
      <div
        className="patient-modal"
        data-testid="patient-form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="patient-form-title"
      >
        <div
          className="modal-header"
          data-testid="patient-form-header"
        >
          <div>
            <span className="modal-eyebrow">
              Cadastro clínico
            </span>

            <h2
              id="patient-form-title"
              data-testid="patient-form-title"
            >
              {title}
            </h2>

            <p
              data-testid="patient-form-description"
            >
              Preencha os dados cadastrais
              do paciente. As informações
              poderão ser atualizadas
              posteriormente.
            </p>
          </div>

          <button
            data-testid="patient-form-close-button"
            type="button"
            className="icon-button"
            onClick={
              onClose
            }
            disabled={
              submitting
            }
            aria-label="Fechar formulário"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="patient-form"
          data-testid="patient-form"
        >
          <div className="patient-form-intro">
            <p
              className="required-fields-hint"
              data-testid="patient-required-fields-hint"
            >
              <span
                className="required-field-mark"
                aria-hidden="true"
              >
                *
              </span>{' '}
              Campos obrigatórios
            </p>
          </div>

          <section
            className="patient-form-section"
            data-testid="patient-form-personal-section"
          >
            <div className="patient-form-section-header">
              <div>
                <span>
                  01
                </span>

                <div>
                  <h3>
                    Dados pessoais
                  </h3>

                  <p>
                    Informações de identificação
                    do paciente.
                  </p>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <label className="full-field">
                <span>
                  Nome completo{' '}

                  <span
                    className="required-field-mark"
                    aria-hidden="true"
                  >
                    *
                  </span>
                </span>

                <input
                  data-testid="patient-name-input"
                  value={
                    form.nomeCompleto
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'nomeCompleto',
                      event
                        .target
                        .value,
                    )
                  }
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                <span>
                  CPF{' '}

                  <span
                    className="required-field-mark"
                    aria-hidden="true"
                  >
                    *
                  </span>
                </span>

                <input
                  data-testid="patient-cpf-input"
                  value={
                    form.cpf
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'cpf',
                      event
                        .target
                        .value,
                    )
                  }
                  inputMode="numeric"
                  required
                />
              </label>

              <label>
                <span>
                  Data de nascimento{' '}

                  <span
                    className="required-field-mark"
                    aria-hidden="true"
                  >
                    *
                  </span>
                </span>

                <input
                  data-testid="patient-birth-date-input"
                  type="date"
                  value={
                    form.dataNascimento
                  }
                  max={
                    new Date()
                      .toISOString()
                      .split(
                        'T',
                      )[0]
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'dataNascimento',
                      event
                        .target
                        .value,
                    )
                  }
                  required
                />
              </label>

              <label>
                Sexo

                <select
                  data-testid="patient-sex-select"
                  value={
                    form.sexo
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'sexo',
                      event
                        .target
                        .value,
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

              <label className="full-field">
                Nome da mãe

                <input
                  data-testid="patient-mother-name-input"
                  value={
                    form.nomeMae
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'nomeMae',
                      event
                        .target
                        .value,
                    )
                  }
                />
              </label>
            </div>
          </section>

          <section
            className="patient-form-section"
            data-testid="patient-form-contact-section"
          >
            <div className="patient-form-section-header">
              <div>
                <span>
                  02
                </span>

                <div>
                  <h3>
                    Contato
                  </h3>

                  <p>
                    Canais utilizados para
                    comunicação com o paciente.
                  </p>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <label>
                <span>
                  Telefone{' '}

                  <span
                    className="required-field-mark"
                    aria-hidden="true"
                  >
                    *
                  </span>
                </span>

                <input
                  data-testid="patient-phone-input"
                  value={
                    form.telefone
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'telefone',
                      event
                        .target
                        .value,
                    )
                  }
                  inputMode="tel"
                  autoComplete="tel"
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
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'telefoneSecundario',
                      event
                        .target
                        .value,
                    )
                  }
                  inputMode="tel"
                />
              </label>

              <label className="full-field">
                E-mail

                <input
                  data-testid="patient-email-input"
                  type="email"
                  value={
                    form.email
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'email',
                      event
                        .target
                        .value,
                    )
                  }
                  autoComplete="email"
                />
              </label>
            </div>
          </section>

          <section
            className="patient-form-section"
            data-testid="patient-form-address-section"
          >
            <div className="patient-form-section-header">
              <div>
                <span>
                  03
                </span>

                <div>
                  <h3>
                    Endereço
                  </h3>

                  <p>
                    Informações de localização
                    e residência.
                  </p>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <label>
                CEP

                <input
                  data-testid="patient-zip-code-input"
                  value={
                    form.cep
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'cep',
                      event
                        .target
                        .value,
                    )
                  }
                  inputMode="numeric"
                  autoComplete="postal-code"
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
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'estado',
                      event
                        .target
                        .value
                        .toUpperCase(),
                    )
                  }
                  autoComplete="address-level1"
                />
              </label>

              <label className="full-field">
                Logradouro

                <input
                  data-testid="patient-address-input"
                  value={
                    form.logradouro
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'logradouro',
                      event
                        .target
                        .value,
                    )
                  }
                  autoComplete="street-address"
                />
              </label>

              <label>
                Número

                <input
                  data-testid="patient-address-number-input"
                  value={
                    form.numero
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'numero',
                      event
                        .target
                        .value,
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
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'complemento',
                      event
                        .target
                        .value,
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
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'bairro',
                      event
                        .target
                        .value,
                    )
                  }
                  autoComplete="address-level3"
                />
              </label>

              <label>
                Cidade

                <input
                  data-testid="patient-city-input"
                  value={
                    form.cidade
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'cidade',
                      event
                        .target
                        .value,
                    )
                  }
                  autoComplete="address-level2"
                />
              </label>
            </div>
          </section>

          <section
            className="patient-form-section"
            data-testid="patient-form-notes-section"
          >
            <div className="patient-form-section-header">
              <div>
                <span>
                  04
                </span>

                <div>
                  <h3>
                    Observações
                  </h3>

                  <p>
                    Informações adicionais
                    relevantes ao cadastro.
                  </p>
                </div>
              </div>
            </div>

            <div className="form-grid">
              <label className="full-field">
                Observações

                <textarea
                  data-testid="patient-notes-input"
                  value={
                    form.observacoes
                  }
                  rows={4}
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      'observacoes',
                      event
                        .target
                        .value,
                    )
                  }
                />
              </label>
            </div>
          </section>

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
              data-testid="patient-form-submit-button"
              type="submit"
              className="primary-button"
              disabled={
                submitting
              }
            >
              {submitting
                ? 'Salvando...'
                : 'Salvar paciente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}