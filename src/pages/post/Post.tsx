import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import Container from 'components/Container';
import { useFormik } from 'formik';
import usePost from 'hooks/usePost';
import useSingleChannel from 'hooks/useSingleChannel';
import { Link } from 'react-router-dom';

export default function Post() {
  const { results, create, domain, channel } = usePost();
  const { value } = useSingleChannel()
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: { subject: '', body: '' },
    onSubmit: (values, { resetForm }) => {
      create(values.subject, values.body);
      resetForm();
    },
  });

  return (
    <Container>
      <Box p={2}>
        <Box>
          <Typography variant='h4'>#{value?.name}</Typography>
        </Box>
        <List>
          {results.map((item) => (
            <Link  key={item.id} to={`/${domain}/${channel}/${item.id}`}>
              <ListItem divider dense>
                <ListItemButton>
                  <ListItemText primary={item.subject} secondary={item.body} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
        <Box p={2}>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                placeholder="Subject"
                fullWidth
                size="small"
                required
                name="subject"
                onChange={handleChange}
                value={values.subject}
              />
            </Box>
            <Box mb={2}>
              <TextField
                placeholder="Body"
                fullWidth
                multiline
                size="small"
                rows={6}
                required
                name="body"
                onChange={handleChange}
                value={values.body}
              />
            </Box>
            <Button type="submit" fullWidth variant="contained">
              Submit
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
}
