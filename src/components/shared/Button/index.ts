import { styled } from '../../../lib/stitches.config';
const Button = styled('button', {
  backgroundColor: '$dark_green',
  borderRadius: '4px',
  fontSize: '0.875rem',
  lineHeight: '1.75',
  width: '100%',
  border: 'none',
  boxShadow: 'none',
  marginTop: '16px',
  transition: 'all',
  transitionDuration: '200ms',
  cursor: 'pointer',
  minWidth: '64px',
  color: '$primary',
  paddingX: '16px',
  paddingY: '6px',
  '&:hover': {
    opacity: '0.8',
  },
  variants: {
    danger: {
      true: {
        backgroundColor: '$danger',
      },
    },
    inactive: {
      true: {
        cursor: 'default',
        '&:hover': {
          opacity: '1',
        },
      },
    },
    selected: {
      true: {
        border: '1px solid $light_green',
      }
    },
    notSelected: {
      true: {
        background: '$light_green',
        color: '$secondary',
      }
    }
  },
});
export default Button;
