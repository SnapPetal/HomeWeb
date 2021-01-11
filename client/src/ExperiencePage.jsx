import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {},
  card: {
    marginBottom: 10,
  },
  media: {
    width: 150,
    padding: 10,
    backgroundColor: '#ffc700',
    borderRadius: 15,
  },
}));

export default function RecipeReviewCard() {
  const classes = useStyles();

  return (
    <div>

      <Card className={classes.card}>
        <CardContent>
          <Link href="https://www.alchemysystems.com" target="_blank">
            <CardMedia
              component="img"
              className={classes.media}
              image="/static/images/alchemy.png"
              title="Intertek Alchemy"
            />
          </Link>
          <hr/>
          <Typography variant="subtitle1" color="textSecondary" component="p">
            Senior Software Architect: 2020 - Present
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            This impressive paella is a perfect party dish and a fun meal to cook together with your
            guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
      </Card>

      <Card className={classes.card} onClick="window.open(https://www.alchemysystems.com, '_blank')">
        <CardContent>
          <Link href="https://www.alchemysystems.com" target="_blank">
            <CardMedia
              component="img"
              className={classes.media}
              image="/static/images/alchemy.png"
              title="Intertek Alchemy"
            />
          </Link>
          <hr/>
          <Typography variant="subtitle1" color="textSecondary" component="p">
            Senior Software Developer: 2004 - 2020
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            <ul>
              <li>Setup Microsoft Visual Studio Online.</li>
              <li>Setup Microsoft Team Foundation Build Server to allow for Continuous Integration.</li>
              <li>Setup common libraries to allow for modular develop that can be reused in multiply solutions by implementing nuget packages hosted in Azure.</li>
              <li>Developing a new solution that will allow proprietary serial communication to be hosted using a windows service along with RabbitMQ.  This change will make it possible to scale the serial communication to multiple mobile platforms.  Another benefit of this change is that it will allow the QA team to automate load testing which in the past has been done manually by the team.</li>
              <li>Developing a new Xamarin forms solution to replace our existing iOS and Windows Store applications.  Another benefit of this change is that it will allow the QA team to automate load testing which in the past has been done manually by the team.  This change will allow for greater code reusability and makes it possible to implement new features simultaneously for multiply mobile platforms.</li>
              <li>Mentor and coach .NET developers on how to implement various design patterns like dependency injection.</li>
              <li>Developed a new JavaScript solution using React that will allow us to play our custom course content on any device.</li>
              <li>Developed a node web service that is used to convert our existing XML format to JSON for our new HTML course player.</li>
            </ul>
          </Typography>
        </CardContent>
        </Card>
        </div>
  );
}
