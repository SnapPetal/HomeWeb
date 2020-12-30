import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {},
  media: {
    width: 150,
    padding: 10,
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();

  return (
    <div>
      <Card className={classes.root}>
        <CardContent>
          <Link href="#" onClick={preventDefault}>
            <CardMedia
              component="img"
              className={classes.media}
              image="/static/images/alchemy.png"
              title="Intertek Alchemy"
            />
          </Link>
          <Typography variant="body2" color="textSecondary" component="p">
            This impressive paella is a perfect party dish and a fun meal to cook together with your
            guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
      </Card> 
    </div>
  );
}
