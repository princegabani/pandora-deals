import React from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    Container,
    Divider,
    Grid,
    Typography,
} from '@mui/material';
import {
    AccountCircle,
    Apartment,
    Assignment,
    AssignmentInd,
    School,
    Work,
} from '@mui/icons-material';
import { Helmet } from 'react-helmet-async';
import account from 'src/_mock/account';
import { Stack } from 'react-bootstrap';

const user = {
    name: 'John Doe',
    title: 'Software Engineer',
    image: 'https://via.placeholder.com/150',
    about:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec accumsan semper, urna nisi viverra dolor, in volutpat odio velit nec ipsum. Praesent eget turpis eget arcu laoreet ullamcorper.',
    skills: ['JavaScript', 'ReactJS', 'Node.js', 'MongoDB', 'CSS'],
    accomplishments: [
        {
            title: 'Project 1',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec accumsan semper, urna nisi viverra dolor, in volutpat odio velit nec ipsum.',
        },
        {
            title: 'Project 2',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec accumsan semper, urna nisi viverra dolor, in volutpat odio velit nec ipsum.',
        },
        {
            title: 'Project 3',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl nec accumsan semper, urna nisi viverra dolor, in volutpat odio velit nec ipsum.',
        },
    ],
};

const ProfilePage = () => {
    return (
        <><Helmet>
            <title> Profile | {account?.companyName} </title>
        </Helmet>
            <Container maxWidth="auto">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Profile
                    </Typography>


                </Stack>
                <Card sx={{ mt: 5 }}>
                    <CardHeader
                        title={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar alt={user.name} src={user.image} sx={{ mr: 2 }} />
                                <Typography variant="h4">{user.name}</Typography>
                            </Box>
                        }
                        subheader={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccountCircle sx={{ mr: 1 }} />
                                <Typography variant="h6">{user.title}</Typography>
                            </Box>
                        }
                    />
                    <Divider />
                    <CardContent>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6">About</Typography>
                            <Typography>{user.about}</Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6">Skills</Typography>
                            <Grid container spacing={1}>
                                {user.skills.map((skill, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Chip label={skill} sx={{ mb: 1 }} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6">Accomplishments</Typography>
                            {user.accomplishments.map((accomplishment, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Typography variant="h6">{accomplishment.title}</Typography>
                                    <Typography>{accomplishment.description}</Typography>
                                </Box>
                            ))}
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="h6"
                            >
                                Employment History
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Work sx={{ mr: 1 }} />
                                <Typography variant="body1">
                                    Software Engineer at Acme Inc. (June 2020 - Present)
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Typography
                                variant="h6"
                            >
                                Education
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <School sx={{ mr: 1 }} />
                                <Typography variant="body1">
                                    Bachelor of Science in Computer Science, University of XYZ (2016 - 2020)
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ p: 2, justifyContent: 'center' }}>
                        <Button variant="contained">Edit Profile</Button>
                    </CardActions>
                </Card>
            </Container>
        </>
    );
};

export default ProfilePage;