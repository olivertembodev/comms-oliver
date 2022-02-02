import {styled} from '../../lib/stitches.config';
import Container from 'components/Container';
import {useFormik} from 'formik';
import usePost from 'hooks/usePost';
import useSingleChannel from 'hooks/useSingleChannel';
import {Link} from 'react-router-dom';
import Button from 'components/shared/Button';
import { Form, InputField, TextArea } from 'components/shared/Form';

const Wrapper = styled('div', {
    paddingX: '16px',
    marginBottom: '24px'
})
const Heading4 = styled('h4', {
    color: '$secondary',
    fontSize: '40px',
    lineHeight: '36px',
    fontWeight: '500',
    margin: 0
})
const List = styled('ul', {
    padding: 0,
    margin: 0
})

const ListItem = styled('li', {
    margin: 0,
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    padding: '24px 0px',
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)'
    },
    '& > a': {
        textDecoration: 'none'
    }
})
const ListItemTextWrapper = styled('div', {paddingX: '24px'});
const PrimaryText = styled('p', {
    margin: '0',
    fontSize: '18px',
    color: '$secondary',
    fontWeight: '500',
    textDecoration: 'underline'
})
const SecondaryText = styled('p', {
    marginBottom: '0',
    marginTop: '6px',
    fontSize: '14px',
    color: '$secondary',
    fontWeight: '400',
    opacity: 0.8,
    textDecoration: 'none'
})
export default function Post() {
    const {results, create, domain, channel} = usePost();
    const {value} = useSingleChannel()
    const {values, handleChange, handleSubmit} = useFormik({
        initialValues: {
            subject: '',
            body: ''
        },
        onSubmit: (values, {resetForm}) => {
            create(values.subject, values.body);
            resetForm();
        }
    });

    return (
        <Container>
            <div>
                <Wrapper>
                    <Heading4>#{value
                            ?.name}</Heading4>
                </Wrapper>
                <List>
                    {results.map((item) => (
                        <ListItem key={item.id}>
                            <Link to={`/${domain}/${channel}/${item.id}`}>
                                <ListItemTextWrapper>
                                    <PrimaryText>{item.subject}</PrimaryText>
                                    <SecondaryText>{item.body}</SecondaryText>
                                </ListItemTextWrapper>
                            </Link>
                        </ListItem>
                    ))}
                </List>
                <Form onSubmit={handleSubmit}>
                    <InputField
                        placeholder="Subject"
                        required
                        name="subject"
                        onChange={handleChange}
                        value={values.subject}/>
                    <TextArea
                        placeholder="Body"
                        rows={6}
                        required
                        name="body"
                        onChange={handleChange}
                        value={values.body}/>
                    <Button type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </Container>
    );
}
