package com.example.cadastro.model.applicationDTO;

public class ApplicationDTO {
    private Long jobId;
    private String jobTitle;
    private String status;

    public ApplicationDTO(Long jobId, String jobTitle, String status) {
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.status = status;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    
}
