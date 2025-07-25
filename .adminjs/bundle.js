(function (React, designSystem, adminjs) {
  "use strict";

  function _interopDefault(e) {
    return e && e.__esModule ? e : { default: e };
  }

  var React__default = /*#__PURE__*/ _interopDefault(React);

  const UploadImageComponent = (props) => {
    const { record, property, onChange } = props;
    const [file, setFile] = React.useState(null);
    const handleFileChange = (event) => {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
      const formData = new FormData();
      formData.append("file", uploadedFile);
      fetch("/admin-cars/public/images", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          onChange(property.name, data.url);
        })
        .catch((err) => console.error("Upload failed:", err));
    };
    return /*#__PURE__*/ React__default.default.createElement(
      designSystem.Box,
      null,
      /*#__PURE__*/ React__default.default.createElement(
        designSystem.Label,
        null,
        property.label
      ),
      /*#__PURE__*/ React__default.default.createElement(designSystem.Input, {
        type: "file",
        onChange: handleFileChange,
      }),
      record?.params[property.name] &&
        /*#__PURE__*/ React__default.default.createElement(
          designSystem.Box,
          {
            marginTop: "lg",
          },
          /*#__PURE__*/ React__default.default.createElement("img", {
            src: record.params[property.name],
            alt: "Uploaded file",
            style: {
              maxWidth: "100%",
              maxHeight: "200px",
            },
          })
        )
    );
  };

  const Edit = ({ property, record, onChange }) => {
    const { translateProperty } = adminjs.useTranslation();
    const { params } = record;
    const { custom } = property;
    const path = adminjs.flat.get(params, custom.filePathProperty);
    const key = adminjs.flat.get(params, custom.keyProperty);
    const file = adminjs.flat.get(params, custom.fileProperty);
    const [originalKey, setOriginalKey] = React.useState(key);
    const [filesToUpload, setFilesToUpload] = React.useState([]);
    React.useEffect(() => {
      // it means means that someone hit save and new file has been uploaded
      // in this case fliesToUpload should be cleared.
      // This happens when user turns off redirect after new/edit
      if (
        (typeof key === "string" && key !== originalKey) ||
        (typeof key !== "string" && !originalKey) ||
        (typeof key !== "string" &&
          Array.isArray(key) &&
          key.length !== originalKey.length)
      ) {
        setOriginalKey(key);
        setFilesToUpload([]);
      }
    }, [key, originalKey]);
    const onUpload = (files) => {
      setFilesToUpload(files);
      onChange(custom.fileProperty, files);
    };
    const handleRemove = () => {
      onChange(custom.fileProperty, null);
    };
    const handleMultiRemove = (singleKey) => {
      const index = (
        adminjs.flat.get(record.params, custom.keyProperty) || []
      ).indexOf(singleKey);
      const filesToDelete =
        adminjs.flat.get(record.params, custom.filesToDeleteProperty) || [];
      if (path && path.length > 0) {
        const newPath = path.map((currentPath, i) =>
          i !== index ? currentPath : null
        );
        let newParams = adminjs.flat.set(
          record.params,
          custom.filesToDeleteProperty,
          [...filesToDelete, index]
        );
        newParams = adminjs.flat.set(
          newParams,
          custom.filePathProperty,
          newPath
        );
        onChange({
          ...record,
          params: newParams,
        });
      } else {
        // eslint-disable-next-line no-console
        console.log(
          "You cannot remove file when there are no uploaded files yet"
        );
      }
    };
    return React__default.default.createElement(
      designSystem.FormGroup,
      null,
      React__default.default.createElement(
        designSystem.Label,
        null,
        translateProperty(property.label, property.resourceId)
      ),
      React__default.default.createElement(designSystem.DropZone, {
        onChange: onUpload,
        multiple: custom.multiple,
        validate: {
          mimeTypes: custom.mimeTypes,
          maxSize: custom.maxSize,
        },
        files: filesToUpload,
      }),
      !custom.multiple &&
        key &&
        path &&
        !filesToUpload.length &&
        file !== null &&
        React__default.default.createElement(designSystem.DropZoneItem, {
          filename: key,
          src: path,
          onRemove: handleRemove,
        }),
      custom.multiple && key && key.length && path
        ? React__default.default.createElement(
            React__default.default.Fragment,
            null,
            key.map((singleKey, index) => {
              // when we remove items we set only path index to nulls.
              // key is still there. This is because
              // we have to maintain all the indexes. So here we simply filter out elements which
              // were removed and display only what was left
              const currentPath = path[index];
              return currentPath
                ? React__default.default.createElement(
                    designSystem.DropZoneItem,
                    {
                      key: singleKey,
                      filename: singleKey,
                      src: path[index],
                      onRemove: () => handleMultiRemove(singleKey),
                    }
                  )
                : "";
            })
          )
        : ""
    );
  };

  const AudioMimeTypes = [
    "audio/aac",
    "audio/midi",
    "audio/x-midi",
    "audio/mpeg",
    "audio/ogg",
    "application/ogg",
    "audio/opus",
    "audio/wav",
    "audio/webm",
    "audio/3gpp2",
  ];
  const ImageMimeTypes = [
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/vnd.microsoft.icon",
    "image/tiff",
    "image/webp",
  ];

  // eslint-disable-next-line import/no-extraneous-dependencies
  const SingleFile = (props) => {
    const { name, path, mimeType, width } = props;
    if (path && path.length) {
      if (mimeType && ImageMimeTypes.includes(mimeType)) {
        return React__default.default.createElement("img", {
          src: path,
          style: { maxHeight: width, maxWidth: width },
          alt: name,
        });
      }
      if (mimeType && AudioMimeTypes.includes(mimeType)) {
        return React__default.default.createElement(
          "audio",
          { controls: true, src: path },
          "Your browser does not support the",
          React__default.default.createElement("code", null, "audio"),
          React__default.default.createElement("track", { kind: "captions" })
        );
      }
    }
    return React__default.default.createElement(
      designSystem.Box,
      null,
      React__default.default.createElement(
        designSystem.Button,
        {
          as: "a",
          href: path,
          ml: "default",
          size: "sm",
          rounded: true,
          target: "_blank",
        },
        React__default.default.createElement(designSystem.Icon, {
          icon: "DocumentDownload",
          color: "white",
          mr: "default",
        }),
        name
      )
    );
  };
  const File = ({ width, record, property }) => {
    const { custom } = property;
    let path = adminjs.flat.get(record?.params, custom.filePathProperty);
    if (!path) {
      return null;
    }
    const name = adminjs.flat.get(
      record?.params,
      custom.fileNameProperty ? custom.fileNameProperty : custom.keyProperty
    );
    const mimeType =
      custom.mimeTypeProperty &&
      adminjs.flat.get(record?.params, custom.mimeTypeProperty);
    if (!property.custom.multiple) {
      if (custom.opts && custom.opts.baseUrl) {
        path = `${custom.opts.baseUrl}/${name}`;
      }
      return React__default.default.createElement(SingleFile, {
        path: path,
        name: name,
        width: width,
        mimeType: mimeType,
      });
    }
    if (custom.opts && custom.opts.baseUrl) {
      const baseUrl = custom.opts.baseUrl || "";
      path = path.map((singlePath, index) => `${baseUrl}/${name[index]}`);
    }
    return React__default.default.createElement(
      React__default.default.Fragment,
      null,
      path.map((singlePath, index) =>
        React__default.default.createElement(SingleFile, {
          key: singlePath,
          path: singlePath,
          name: name[index],
          width: width,
          mimeType: mimeType[index],
        })
      )
    );
  };

  const List = (props) =>
    React__default.default.createElement(File, { width: 100, ...props });

  const Show = (props) => {
    const { property } = props;
    const { translateProperty } = adminjs.useTranslation();
    return React__default.default.createElement(
      designSystem.FormGroup,
      null,
      React__default.default.createElement(
        designSystem.Label,
        null,
        translateProperty(property.label, property.resourceId)
      ),
      React__default.default.createElement(File, { width: "100%", ...props })
    );
  };

  AdminJS.UserComponents = {};
  AdminJS.UserComponents.UploadImageComponent = UploadImageComponent;
  AdminJS.UserComponents.UploadEditComponent = Edit;
  AdminJS.UserComponents.UploadListComponent = List;
  AdminJS.UserComponents.UploadShowComponent = Show;
})(React, AdminJSDesignSystem, AdminJS);
