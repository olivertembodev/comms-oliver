import { styled } from '../../../lib/stitches.config';
const Button = styled('button', {
  backgroundColor: 'transparent',
  borderRadius: '4px',
  fontSize: '0.875rem',
  lineHeight: '1.75',
  width: '100%',
  boxShadow: 'none',
  marginTop: '16px',
  transition: 'all',
  transitionDuration: '150ms',
  cursor: 'pointer',
  border: '1px solid $secondary',
  minWidth: '64px',
  color: '$secondary',
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
    },
    isActiveComponent: {
      true: {
        backgroundColor: 'rgba(0,0,0,0.45)',
      }
    },
    isHidden: {
      true: {
        border: 'none',
        padding: 0,
        margin: 0,
        boxShadow: 'none',
      }
    }
  },
});
export default Button;
