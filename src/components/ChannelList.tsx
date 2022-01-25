import useChannel from 'hooks/useChannel';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  ListItemText,
  List,
  ListItem,
  ListItemButton,
} from '@mui/material';
import { useFormik } from 'formik';

export default function ChannelList() {
  const { create, results, domain } = useChannel();

  const { values, handleSubmit, handleChange } = useFormik({
    initialValues: { channel: '' },
    onSubmit: (values, { resetForm }) => {
      create(values.channel);
      resetForm();
    },
  });

  return (
    <Box p={2}>
      <Box mb={1}>
        <List>
          {results.map((item) => (
            <div key={item.id}>
              <Link to={`/${domain}/${item.id}`}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemText primary={`#${item.name}`} />
                  </ListItemButton>
                </ListItem>
              </Link>
            </div>
          ))}
        </List>
      </Box>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          placeholder="Input new channel"
          size="small"
          name="channel"
          onChange={handleChange}
          value={values.channel}
        />
        <Box mt={1}>
          <Button fullWidth type="submit" variant="contained">
            New Channel
          </Button>
        </Box>
      </form>
    </Box>
  );
}
