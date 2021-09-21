import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  makeStyles,
  Box,
  CircularProgress,
} from "@material-ui/core";

import colors from "../constants/colors";
import Status from "./Status";

const Node = ({ node, expanded, toggleNodeExpanded }) => {
  const classes = useStyles();
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${node.url}/api/v1/blocks`);

        if (res.status >= 400) {
          return;
        }

        const json = await res.json();

        setBlocks(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, [node]);

  return (
    <Accordion
      elevation={3}
      className={classes.root}
      expanded={expanded}
      onChange={() => toggleNodeExpanded(node)}
    >
      <AccordionSummary
        className={classes.summary}
        classes={{
          expandIcon: classes.icon,
          content: classes.content,
          expanded: classes.expanded,
        }}
        expandIcon={<ExpandMoreIcon />}
      >
        <Box className={classes.summaryContent}>
          <Box>
            <Typography variant="h5" className={classes.heading}>
              {node.name || "Unknown"}
            </Typography>
            <Typography
              variant="subtitle1"
              className={classes.secondaryHeading}
            >
              {node.url}
            </Typography>
          </Box>
          <Status loading={node.loading} online={node.online} />
        </Box>
      </AccordionSummary>
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <p className={classes.error}>We couldn't load the block. Try again!</p>
      ) : (
        blocks.map((block) => (
          <AccordionDetails className={classes.blocksContainer} key={block.id}>
            <Typography className={classes.blockOrderNumber}>
              {block.id}
            </Typography>
            <Typography className={classes.blockContent}>
              {block.attributes.data}
            </Typography>
          </AccordionDetails>
        ))
      )}
    </Accordion>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "16px 0",
    boxShadow: "0px 3px 6px 1px rgba(0,0,0,0.15)",
    "&:before": {
      backgroundColor: "unset",
    },
  },
  summary: {
    padding: "0 24px",
  },
  summaryContent: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingRight: 20,
  },
  icon: {
    color: colors.faded,
  },
  content: {
    margin: "10px 0 !important", // Avoid change of sizing on expanded
  },
  expanded: {
    "& $icon": {
      paddingLeft: 0,
      paddingRight: 12,
      top: -10,
      marginRight: 0,
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(17),
    display: "block",
    color: colors.text,
    lineHeight: 1.5,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(14),
    color: colors.faded,
    lineHeight: 2,
  },
  blocksContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: colors.blocksContainerBackground,
    margin: "0 13px 4px 13px",
    borderRadius: "2px",
  },
  blockOrderNumber: {
    color: colors.primaryText,
    fontWeight: "bold",
    fontSize: "10px",
    lineHeight: "16px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  blockContent: {
    color: colors.text,
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: ".25px",
  },
  error: {
    padding: "0 24px",
    color: colors.danger,
  },
}));

Node.propTypes = {
  node: PropTypes.shape({
    url: PropTypes.string,
    online: PropTypes.bool,
    name: PropTypes.string,
    loading: PropTypes.bool,
  }).isRequired,
  expanded: PropTypes.bool,
  toggleNodeExpanded: PropTypes.func.isRequired,
};

export default Node;
