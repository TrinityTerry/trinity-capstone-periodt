import React, { useState } from "react";

import { Checkbox } from "semantic-ui-react";

const PT_CHECKBOX = ({ getValue, handleChange, checkId, value }) => {
  const [checked, setChecked] = useState(false);
  const toggle = e => {
    setChecked(!checked);
    getValue(e.target.checked, e.target.id);
  };

  return (
    <Checkbox
      toggle
      id={checkId}
      onChange={handleChange || toggle}
      checked={value || checked}
    />
  );
};

export default PT_CHECKBOX;
