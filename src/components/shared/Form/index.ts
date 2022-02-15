import { styled } from '../../../lib/stitches.config';
export const Form = styled('form', { padding: '24px 16px' });
export const InputField = styled('input', {
  width: '100%',
  padding: '20px 16px',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  marginBottom: '16px',
  fontSize: '18px',
  color: '$secondary',
  '&:hover': {
    border: '1px solid $secondary',
  },
  '&:focus': {
    outline: 'none',
    border: '1px solid $dark_green',
  },
  variants: {
    spacedTop: {
      true: {
        marginTop: '16px',
      },
    },
  },
});
export const TextArea = styled('textarea', {
  width: '100%',
  padding: '20px 16px',
  borderRadius: '4px',
  marginBottom: '16px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  fontSize: '18px',
  color: '$secondary',
  '&:hover': {
    border: '1px solid $secondary',
  },
  '&:focus': {
    outline: 'none',
    border: '1px solid $dark_green',
  },
});
