import styled from 'styled-components'

export const Group = styled.div`
  display: flex;
  flex-direction: column;
`

export const EyeBorder = styled.div`
  overflow: hidden;
  line-height: 0;
  width: 100vw;
  margin-left: calc(50% - 50vw);
  margin-bottom: -4px;

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`
