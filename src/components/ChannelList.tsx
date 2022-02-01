import useChannel from 'hooks/useChannel';
import {Link} from 'react-router-dom';
import {styled} from '../lib/stitches.config';
import {useFormik} from 'formik';
import Button from './shared/Button';
import { Form, InputField } from './shared/Form';

const Wrapper = styled('div', {paddingY: '16px'})
const List = styled('ul', {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 260px)',
})
const ListItem = styled('li', {
    padding: '6px 24px',
    cursor: 'pointer',
    color: '$secondary',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
})
const HeadingWrapper = styled('p', {
    paddingX: '12px',
    color: '$secondary',
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: '600',
    paddingTop: '12px',
    marginTop: '0px',
    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
})

export default function ChannelList() {
    const {create, results, domain} = useChannel();

    const {values, handleSubmit, handleChange} = useFormik({
        initialValues: {
            channel: ''
        },
        onSubmit: (values, {resetForm}) => {
            create(values.channel);
            resetForm();
        }
    });

    return (
        <Wrapper>
            <HeadingWrapper>Channels:</HeadingWrapper>
            <List>
                {results.map((item) => (
                    <ListItem key={item.id}>
                        <Link to={`/${domain}/${item.id}`}>
                            #{item.name}
                        </Link>
                    </ListItem>
                ))}
            </List>
            <Form onSubmit={handleSubmit}>
                <InputField
                    placeholder="Input new channel"
                    name="channel"
                    required
                    onChange={handleChange}
                    value={values.channel}/>
                <Button type="submit">
                    New Channel
                </Button>
            </Form>
        </Wrapper>
    );
}
