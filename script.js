const { jsPDF } = window.jspdf;
      
      function switchTab(tabId) {
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active");
        });

        document.querySelectorAll(".tab").forEach((tab) => {
          tab.classList.remove("active");
        });

        document.getElementById(tabId + "-tab").classList.add("active");
        event.currentTarget.classList.add("active");
      }

      const jobTypeElement = document.getElementById("jobType");
      const packageGroup = document.getElementById("packageGroup");
      const stipendGroup = document.getElementById("stipendGroup");
      const internshipDurationGroup = document.getElementById(
        "internshipDurationGroup"
      );

      jobTypeElement.addEventListener("change", function () {
        const jobType = jobTypeElement.value;
        packageGroup.style.display =
          jobType === "placement_with_internship" || jobType === "placement"
            ? "block"
            : "none";
        stipendGroup.style.display = jobType !== "placement" ? "block" : "none";
        internshipDurationGroup.style.display =
          jobType === "internship" || jobType === "placement_with_internship"
            ? "block"
            : "none";
      });

      const joiningRadios = document.getElementsByName("joining");
      const customJoiningTextField = document.getElementById("customJoining");

      joiningRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
          customJoiningTextField.style.display =
            this.value === "Custom" ? "block" : "none";
        });
      });

      const responsibilityRadios = document.getElementsByName("responsibility");
      const customResponsibilityTextField = document.getElementById(
        "customResponsibility"
      );

      responsibilityRadios.forEach((radio) => {
        radio.addEventListener("change", function () {
          customResponsibilityTextField.style.display =
            this.value === "Custom" ? "block" : "none";
        });
      });

      function addCoordinator() {
        const div = document.createElement("div");
        div.className = "coordinator";
        div.innerHTML = `
          <input type="text" placeholder="Name" class="coord-name form-control" required />
          <input type="text" placeholder="Phone" class="coord-phone form-control" required />
          <button type="button" class="danger-button" onclick="this.parentElement.remove()">Remove</button>
        `;
        document.getElementById("coordinatorsList").appendChild(div);
      }

      function generateNotice() {
        const company = document.getElementById("company").value;
        const eligibleStream = document.getElementById("eligibleStream").value;
        const jobLocation = document.getElementById("jobLocation").value;
        const jobRole = document.getElementById("jobRole").value;
        const packageText = document.getElementById("package").value;
        const stipendText = document.getElementById("stipend").value;
        const internshipDurationText =
          document.getElementById("internshipDuration").value;
        const lastDate = document.getElementById("lastDate").value;
        const googleForm = document.getElementById("googleForm").value;
        const whatsappGroup = document.getElementById("whatsappGroup").value;
        const coordinators = document.querySelectorAll(".coordinator");

        const batches = [];
        document
          .querySelectorAll('.checkbox-group input[type="checkbox"]:checked')
          .forEach((checkbox) => {
            batches.push(checkbox.value);
          });

        const coordinatorsText = Array.from(coordinators)
          .map(
            (coord) =>
              `Name: ${coord.querySelector(".coord-name").value}, Phone: ${
                coord.querySelector(".coord-phone").value
              }`
          )
          .join("\n");

        let joiningText = "Immediate Joiner";
        if (
          document.querySelector('input[name="joining"]:checked').value ===
          "Custom"
        ) {
          joiningText = customJoiningTextField.value || "Immediate Joiner";
        }

        let responsibilityText = "Refer JD";
        if (
          document.querySelector('input[name="responsibility"]:checked')
            .value === "Custom"
        ) {
          responsibilityText =
            customResponsibilityTextField.value || "Refer JD";
        }

        let packageTextFormatted = packageText;
        if (
          document.getElementById("performanceBased").checked &&
          packageText
        ) {
          packageTextFormatted = `${packageText} (Based on performance)`;
        }

        let stipendTextFormatted = stipendText;
        if (document.getElementById("unpaid").checked && stipendText) {
          stipendTextFormatted = `${stipendText} (Unpaid)`;
        }

        const modeOfWork = document.getElementById("modeOfWork").value;

        let notice = `
*FINAL PLACEMENT NOTICE*
For *${batches.join(", ")}* Batch

*Company:* ${company}

*Eligible Stream:* ${eligibleStream}

*Job Location:* ${jobLocation}

*Job Role:* ${jobRole}

`;

        if (jobTypeElement.value !== "internship") {
          notice += `\n*Package:* ${packageTextFormatted}\n\n`;
          if (stipendGroup.style.display !== "none") {
            notice += `*Stipend:* ${stipendTextFormatted}\n\n`;
            notice += `*Internship Duration:* ${internshipDurationText}\n\n`;
          }
        }

        if (jobTypeElement.value === "internship") {
          notice += `\n*Stipend:* ${stipendTextFormatted}\n\n`;
          notice += `*Internship Duration:* ${internshipDurationText}\n\n`;
        }

        notice += `
*Joining:* ${joiningText}\n

*Mode of Work:* ${
          modeOfWork.charAt(0).toUpperCase() +
          modeOfWork.slice(1).replace("_", " ")
        } 

*Responsibility:* ${responsibilityText}\n

All the eligible and interested students need to register at the below-mentioned link and join the WhatsApp group on or before *${lastDate}*.

*Google Form:* ${googleForm}

*WhatsApp Group:* ${whatsappGroup}

*Placement Coordinators:*
${coordinatorsText}

*Thanks & Regards,*
Anand Solanki
Deputy Director- Placement & Corporate Relations
Direct No: 8668362727
Indira Group of Institutes.
Pune.`;

        notice = notice.trim();

        document.getElementById("generatedNotice").textContent = notice;
        document.getElementById("copyButton").style.display = "inline-block";
        document.getElementById("downloadPdfButton").style.display = "inline-block";
      }

      document
        .getElementById("copyButton")
        .addEventListener("click", function () {
          const text = document.getElementById("generatedNotice").textContent;
          navigator.clipboard.writeText(text).then(
            () => alert("Notice copied to clipboard!"),
            (err) => alert("Failed to copy: " + err)
          );
        });

      document
        .getElementById("copyWhatsappMessage")
        .addEventListener("click", function () {
          const whatsappMessage =
            document.getElementById("generatedNotice").textContent;
          const whatsappLink = `https://wa.me/?text=${encodeURIComponent(
            whatsappMessage
          )}`;
          window.open(whatsappLink, "_blank");
        });

      document
        .getElementById("downloadPdfButton")
        .addEventListener("click", function () {
          generatePdf();
        });

        function generatePdf() {
          const company = document.getElementById("company").value;
          const noticeText = document.getElementById("generatedNotice").textContent;
          
          // Create PDF with better settings
          const doc = new jsPDF({
              orientation: 'portrait',
              unit: 'mm',
              format: 'a4',
              compress: true
          });
          
          // Set document properties
          doc.setProperties({
              title: `Placement Notice - ${company}`,
              subject: 'Placement Notice',
              author: 'Indira Group of Institutes',
              keywords: 'placement, notice, job',
              creator: 'Placement Notice Generator',
              creationDate: new Date()
          });
          
          // Add metadata
          doc.setLanguage('en-IN');
          doc.setFont('helvetica');
          
          // Center-aligned letterhead
          const pageWidth = doc.internal.pageSize.getWidth();
          const centerX = pageWidth / 2;
          
          // Try to add centered logo
          try {
        const logoImg = document.getElementById("logoImage");
        if (logoImg && logoImg.src) {
            const logoWidth = 25;
            const logoHeight = (logoImg.naturalHeight / logoImg.naturalWidth) * logoWidth;
            doc.addImage(logoImg.src, 'JPEG', margin, 15, logoWidth, logoHeight);
        }
    } catch (e) {
        console.log("Could not add logo to PDF", e);
    }
    
    // Header section with better typography
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 51, 102); // Dark blue color
    doc.text("Indira Group of Institutes", centerX, 22, { align: 'center' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70); // Dark gray
    doc.text("Address: 89/2-A, New Pune-Mumbai Highway, Tathawade, Pune - 411033", centerX, 28, { align: 'center' });
    doc.text("Phone: +91 20 6674 1234 | Email: placement@indira.edu | Website: www.indira.edu", centerX, 33, { align: 'center' });
          
          // Centered divider line
          doc.setDrawColor(100, 100, 100);
          doc.setLineWidth(0.3);
          doc.line(15, 45, pageWidth - 15, 45);
          
          // Main title - Centered with hierarchy
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("INDIRA", centerX, 55, { align: 'center' });
          
          doc.setFontSize(16);
          doc.text("PLACEMENT NOTICE", centerX, 65, { align: 'center' });
          
          // Process notice text
          const formattedNotice = noticeText
              .replace(/\*/g, '')
              .split('\n')
              .filter(line => line.trim() !== '');
          
          // Main content - Left aligned but centered on page
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          
          let yPosition = 75;
          const lineHeight = 7;
          const contentWidth = 150; // Narrower for better readability
          const contentLeft = (pageWidth - contentWidth) / 2;
          
          formattedNotice.forEach(line => {
              if (yPosition > 270) {
                  doc.addPage();
                  yPosition = 20;
              }
              
              // Handle different text styles
              if (line.toUpperCase() === line && line.match(/[A-Z]/)) {
                  // Uppercase lines (like headings)
                  doc.setFont("helvetica", "bold");
                  const lines = doc.splitTextToSize(line, contentWidth);
                  doc.text(lines, centerX, yPosition, { align: 'center' });
                  yPosition += lines.length * lineHeight;
                  doc.setFont("helvetica", "normal");
              } else {
                  // Regular text
                  const lines = doc.splitTextToSize(line, contentWidth);
                  doc.text(lines, contentLeft, yPosition, { align: 'left' });
                  yPosition += lines.length * lineHeight;
              }
          });
          
          // Footer
          const footerY = 285;
          doc.setFontSize(8);
          doc.setFont("helvetica", "italic");
          doc.text("Generated by Indira Group of Institutes Placement Cell", centerX, footerY, { align: 'center' });
          doc.text(new Date().toLocaleDateString('en-IN'), pageWidth - 15, footerY, { align: 'right' });
          
          // Save PDF
          const sanitizedCompany = company.replace(/[^a-zA-Z0-9\s]/g, '_').replace(/\s+/g, '_');
          const filename = `Placement_Notice_${sanitizedCompany}_${new Date().toISOString().slice(0, 10)}.pdf`;
          doc.save(filename);
      }
