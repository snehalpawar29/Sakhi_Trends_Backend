import React from "react";

const CategoryForm = ({
  handleSubmit,
  value,
  setValue,
  subValue,
  setSubValue,
  childValue,
  setChildValue,
  setImage,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Category Name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Sub Category"
          value={subValue}
          onChange={(e) => setSubValue(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Child Category"
          value={childValue}
          onChange={(e) => setChildValue(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label className="btn btn-outline-secondary col-12">
          {/** Image upload input */}
          Upload Image
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            hidden
          />
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </form>
  );
};

export default CategoryForm;
