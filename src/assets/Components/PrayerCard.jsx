import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';




    export default function MediaCard({name,time,image}) {
    return (
        <>
        <Card sx={{ maxWidth: 300 }}>
        <CardMedia style={{width: '200px'}}
        sx={{ height: 150 }}
        image={image} 
        // title="green iguana"
    />
        
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            {name}
            </Typography>
            <Typography variant="h2" color="text.secondary" >
            {time}
            </Typography>
        </CardContent>
        
        </Card>
        </>
    );

    }