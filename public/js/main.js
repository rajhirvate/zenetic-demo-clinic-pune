(function () {
  "use strict";

  var form = document.getElementById("appointment-form");
  if (!form) return;

  var success = document.getElementById("form-success");
  var successTitle = document.getElementById("success-title");
  var successSummary = document.getElementById("success-summary");
  var successWhatsapp = document.getElementById("success-whatsapp");
  var editButton = document.getElementById("edit-request");
  var alertBox = document.getElementById("form-alert");
  var dateInput = document.getElementById("preferred-date");
  var waNumber = document.body.getAttribute("data-wa") || "919000000000";

  var fields = {
    name: document.getElementById("full-name"),
    phone: document.getElementById("phone"),
    date: dateInput,
    department: document.getElementById("department"),
    message: document.getElementById("message")
  };

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  function toISO(date) {
    return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate());
  }

  function startOfToday() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  function parseISO(iso) {
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    if (!match) return null;
    var year = Number(match[1]);
    var month = Number(match[2]);
    var day = Number(match[3]);
    var date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
      return null;
    }
    return date;
  }

  function formatDate(iso) {
    var parts = iso.split("-");
    return parts[2] + "/" + parts[1] + "/" + parts[0];
  }

  var today = startOfToday();
  var maxDate = new Date(today.getFullYear(), today.getMonth() + 6, today.getDate());
  dateInput.min = toISO(today);
  dateInput.max = toISO(maxDate);

  function fieldWrap(input) {
    return input.closest(".field");
  }

  function clearField(input) {
    var wrap = fieldWrap(input);
    var error = wrap.querySelector(".field-error");
    input.removeAttribute("aria-invalid");
    wrap.classList.remove("is-invalid");
    if (error) {
      error.hidden = true;
      error.textContent = "";
    }
  }

  function showError(input, message) {
    var wrap = fieldWrap(input);
    var error = wrap.querySelector(".field-error");
    input.setAttribute("aria-invalid", "true");
    wrap.classList.add("is-invalid");
    if (error) {
      error.hidden = false;
      error.textContent = message;
    }
  }

  function hasLetter(value) {
    try {
      return /\p{L}/u.test(value);
    } catch (error) {
      return /[a-zA-Z]/.test(value);
    }
  }

  function tidyPhone(value) {
    var digits = value.replace(/\D/g, "");
    if (digits.length === 12 && digits.indexOf("91") === 0) digits = digits.slice(2);
    if (digits.length === 11 && digits.charAt(0) === "0") digits = digits.slice(1);
    return digits;
  }

  function allowedDepartments() {
    return Array.prototype.map.call(fields.department.options, function (option) {
      return option.value;
    }).filter(Boolean);
  }

  function validate() {
    var errors = [];

    var name = fields.name.value.trim().replace(/\s+/g, " ");
    if (name.length < 2 || name.length > 80 || !hasLetter(name)) {
      errors.push({ input: fields.name, message: "Enter a name using letters (at least 2 characters)." });
    }

    var phoneDigits = tidyPhone(fields.phone.value);
    if (!/^[6-9][0-9]{9}$/.test(phoneDigits)) {
      errors.push({
        input: fields.phone,
        message: "Enter a 10-digit Indian mobile number, starting with 6, 7, 8 or 9."
      });
    }

    var dateValue = fields.date.value;
    var date = parseISO(dateValue);
    if (!date || date < today || date > maxDate) {
      errors.push({
        input: fields.date,
        message: "Choose today or a date within the next 6 months."
      });
    }

    var department = fields.department.value;
    if (allowedDepartments().indexOf(department) === -1) {
      errors.push({ input: fields.department, message: "Choose a department." });
    }

    var message = fields.message.value.trim();
    if (message.length > 500) {
      errors.push({ input: fields.message, message: "Use 500 characters or fewer." });
    }

    return {
      errors: errors,
      data: {
        name: name,
        phone: "+91 " + phoneDigits.slice(0, 5) + " " + phoneDigits.slice(5),
        dateLabel: date ? formatDate(dateValue) : "",
        department: department,
        message: message
      }
    };
  }

  function whatsappHref(data) {
    var lines = [
      "Hello, this is a sample enquiry from the Demo Clinic, Baner website.",
      "It is a demo and not a real booking.",
      "Name: " + data.name,
      "Phone: " + data.phone,
      "Preferred date: " + data.dateLabel,
      "Department: " + data.department
    ];
    if (data.message) lines.push("Message: " + data.message);
    return "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  function fillSummary(data) {
    successSummary.replaceChildren();
    [
      ["Name", data.name],
      ["Phone", data.phone],
      ["Preferred date", data.dateLabel],
      ["Department", data.department],
      ["Message", data.message || "—"]
    ].forEach(function (row) {
      var term = document.createElement("dt");
      term.textContent = row[0];
      var detail = document.createElement("dd");
      detail.textContent = row[1];
      successSummary.append(term, detail);
    });
  }

  Object.keys(fields).forEach(function (key) {
    var input = fields[key];
    function onEdit() {
      clearField(input);
      if (alertBox && !form.querySelector(".is-invalid")) alertBox.hidden = true;
    }
    input.addEventListener("input", onEdit);
    input.addEventListener("change", onEdit);
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    Object.keys(fields).forEach(function (key) {
      clearField(fields[key]);
    });

    var result = validate();
    if (result.errors.length) {
      result.errors.forEach(function (item) {
        showError(item.input, item.message);
      });
      alertBox.hidden = false;
      alertBox.textContent = "Please fix the highlighted fields. Nothing has been sent.";
      result.errors[0].input.focus();
      return;
    }

    alertBox.hidden = true;
    fillSummary(result.data);
    successWhatsapp.href = whatsappHref(result.data);
    form.hidden = true;
    success.hidden = false;
    successTitle.focus();
  });

  editButton.addEventListener("click", function () {
    success.hidden = true;
    form.hidden = false;
    fields.name.focus();
  });
})();
