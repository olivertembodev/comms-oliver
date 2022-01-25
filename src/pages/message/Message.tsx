import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import Container from 'components/Container';
import { useFormik } from 'formik';
import useMessage from 'hooks/useMessage';
import useUser from 'hooks/useUser';
import useSinglePost from 'hooks/useSinglePost';

export default function Message() {
  const { value } = useSinglePost()
  const { results, create } = useMessage();
  const { user } = useUser();

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: { text: '' },
    onSubmit: (values, { resetForm }) => {
      create(values.text);
      resetForm();
    },
  });

  return (
    <Container>
      <Box p={2}>
        <Box mb={2}>
          <Typography variant='h3'>
            {value?.subject}
          </Typography>
          <Typography>
            Body: {value?.body}
          </Typography>
        </Box>
        <Typography variant='h5'>
            Message
          </Typography>
        <List>
          {results.map((item) => (
            <ListItem divider dense key={item.id}>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ variant: "subtitle1" }}
                secondary={
                  `From: ${item.user?.name === user.displayName ? 'You' : item.user?.name || ''}`
                }
              />
            </ListItem>
          ))}
        </List>
        <Box p={2}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                placeholder="Message"
                fullWidth
                size="small"
                required
                name="text"
                onChange={handleChange}
                value={values.text}
              />
            </Box>
            <Button type="submit" fullWidth variant="contained">
              Send
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
}
