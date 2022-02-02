import {styled} from '../../../lib/stitches.config';
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
        opacity: '0.8'
    }
});
export default Button;