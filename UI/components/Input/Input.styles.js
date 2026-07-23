import styled from 'styled-components'

export const InputBase = styled.input`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.charcoal};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.charcoal};
  padding: 12px 14px;
  outline: none;
  width: 100%;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.olive};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.sageFade};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.sage};
  }
`

export const TextareaBase = styled.textarea`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.charcoal};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.charcoal};
  padding: 12px 14px;
  outline: none;
  width: 100%;
  resize: vertical;
  min-height: 120px;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.olive};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.sageFade};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.sage};
  }
`

export const SelectBase = styled.select`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.charcoal};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.charcoal};
  padding: 12px 14px;
  outline: none;
  width: 100%;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:focus {
    border-color: ${({ theme }) => theme.colors.olive};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.sageFade};
  }
`

export const LabelEl = styled.label`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sage};
  display: block;
  margin-bottom: 6px;
`

export const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`
