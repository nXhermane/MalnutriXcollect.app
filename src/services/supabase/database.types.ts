export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      admission_variable_entries: {
        Row: {
          admission_type: string;
          created_at: number;
          deleted_at: number | null;
          id: string;
          marked_at: number;
          registry_id: string;
          source_code: string;
          source_id: string;
          source_trigger_identifier: string;
          source_type: string;
          updated_at: number;
          variable_code: string;
          variable_type: string;
        };
        Insert: {
          admission_type: string;
          created_at: number;
          deleted_at?: number | null;
          id: string;
          marked_at: number;
          registry_id: string;
          source_code: string;
          source_id: string;
          source_trigger_identifier: string;
          source_type: string;
          updated_at: number;
          variable_code: string;
          variable_type: string;
        };
        Update: {
          admission_type?: string;
          created_at?: number;
          deleted_at?: number | null;
          id?: string;
          marked_at?: number;
          registry_id?: string;
          source_code?: string;
          source_id?: string;
          source_trigger_identifier?: string;
          source_type?: string;
          updated_at?: number;
          variable_code?: string;
          variable_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'admission_variable_entries_registry_id_fkey';
            columns: ['registry_id'];
            isOneToOne: false;
            referencedRelation: 'admission_variable_registries';
            referencedColumns: ['id'];
          },
        ];
      };
      admission_variable_registries: {
        Row: {
          created_at: number;
          deleted_at: number | null;
          id: string;
          session_id: string;
          updated_at: number;
        };
        Insert: {
          created_at: number;
          deleted_at?: number | null;
          id: string;
          session_id: string;
          updated_at: number;
        };
        Update: {
          created_at?: number;
          deleted_at?: number | null;
          id?: string;
          session_id?: string;
          updated_at?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'admission_variable_registries_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'care_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      anthropometric_data: {
        Row: {
          can_be_edited: boolean;
          code: string;
          context: string;
          created_at: number;
          deleted_at: number | null;
          id: string;
          medical_record_id: string;
          unit: string;
          updated_at: number;
          value: number;
        };
        Insert: {
          can_be_edited: boolean;
          code: string;
          context: string;
          created_at: number;
          deleted_at?: number | null;
          id: string;
          medical_record_id: string;
          unit: string;
          updated_at: number;
          value: number;
        };
        Update: {
          can_be_edited?: boolean;
          code?: string;
          context?: string;
          created_at?: number;
          deleted_at?: number | null;
          id?: string;
          medical_record_id?: string;
          unit?: string;
          updated_at?: number;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'anthropometric_data_medical_record_id_fkey';
            columns: ['medical_record_id'];
            isOneToOne: false;
            referencedRelation: 'medical_records';
            referencedColumns: ['id'];
          },
        ];
      };
      appetite_test_records: {
        Row: {
          can_be_edited: boolean;
          created_at: number;
          data: string;
          deleted_at: number | null;
          field_responses: string;
          id: string;
          medical_record_id: string;
          result: string;
          updated_at: number;
        };
        Insert: {
          can_be_edited: boolean;
          created_at: number;
          data: string;
          deleted_at?: number | null;
          field_responses: string;
          id: string;
          medical_record_id: string;
          result: string;
          updated_at: number;
        };
        Update: {
          can_be_edited?: boolean;
          created_at?: number;
          data?: string;
          deleted_at?: number | null;
          field_responses?: string;
          id?: string;
          medical_record_id?: string;
          result?: string;
          updated_at?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'appetite_test_records_medical_record_id_fkey';
            columns: ['medical_record_id'];
            isOneToOne: false;
            referencedRelation: 'medical_records';
            referencedColumns: ['id'];
          },
        ];
      };
      biological_data: {
        Row: {
          can_be_edited: boolean;
          code: string;
          created_at: number;
          deleted_at: number | null;
          id: string;
          medical_record_id: string;
          unit: string;
          updated_at: number;
          value: number;
        };
        Insert: {
          can_be_edited: boolean;
          code: string;
          created_at: number;
          deleted_at?: number | null;
          id: string;
          medical_record_id: string;
          unit: string;
          updated_at: number;
          value: number;
        };
        Update: {
          can_be_edited?: boolean;
          code?: string;
          created_at?: number;
          deleted_at?: number | null;
          id?: string;
          medical_record_id?: string;
          unit?: string;
          updated_at?: number;
          value?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'biological_data_medical_record_id_fkey';
            columns: ['medical_record_id'];
            isOneToOne: false;
            referencedRelation: 'medical_records';
            referencedColumns: ['id'];
          },
        ];
      };
      care_phase_executions: {
        Row: {
          created_at: number;
          deleted_at: number | null;
          ended_at: number | null;
          enforced_at: number | null;
          failing_at: number | null;
          id: string;
          initializing_at: number | null;
          is_active: boolean;
          is_enforced: boolean;
          metadata: string;
          phase_code: string;
          phase_id: string;
          resolving_at: number | null;
          session_id: string;
          started_at: number | null;
          status: string;
          updated_at: number;
        };
        Insert: {
          created_at: number;
          deleted_at?: number | null;
          ended_at?: number | null;
          enforced_at?: number | null;
          failing_at?: number | null;
          id: string;
          initializing_at?: number | null;
          is_active: boolean;
          is_enforced: boolean;
          metadata: string;
          phase_code: string;
          phase_id: string;
          resolving_at?: number | null;
          session_id: string;
          started_at?: number | null;
          status: string;
          updated_at: number;
        };
        Update: {
          created_at?: number;
          deleted_at?: number | null;
          ended_at?: number | null;
          enforced_at?: number | null;
          failing_at?: number | null;
          id?: string;
          initializing_at?: number | null;
          is_active?: boolean;
          is_enforced?: boolean;
          metadata?: string;
          phase_code?: string;
          phase_id?: string;
          resolving_at?: number | null;
          session_id?: string;
          started_at?: number | null;
          status?: string;
          updated_at?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'care_phase_executions_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'care_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
      care_sessions: {
        Row: {
          abandoned_at: number | null;
          abandoned_reason: string | null;
          active_phase_execution_id: string | null;
          admission_variable_registry_id: string | null;
          completed_at: number | null;
          created_at: number;
          deleted_at: number | null;
          enforced_cycle_log_json: string;
          id: string;
          patient_id: string;
          settings_json: string;
          started_at: number;
          status: string;
          updated_at: number;
          variable_changing_day_registry_id: string | null;
        };
        Insert: {
          abandoned_at?: number | null;
          abandoned_reason?: string | null;
          active_phase_execution_id?: string | null;
          admission_variable_registry_id?: string | null;
          completed_at?: number | null;
          created_at: number;
          deleted_at?: number | null;
          enforced_cycle_log_json: string;
          id: string;
          patient_id: string;
          settings_json: string;
          started_at: number;
          status: string;
          updated_at: number;
          variable_changing_day_registry_id?: string | null;
        };
        Update: {
          abandoned_at?: number | null;
          abandoned_reason?: string | null;
          active_phase_execution_id?: string | null;
          admission_variable_registry_id?: string | null;
          completed_at?: number | null;
          created_at?: number;
          deleted_at?: number | null;
          enforced_cycle_log_json?: string;
          id?: string;
          patient_id?: string;
          settings_json?: string;
          started_at?: number;
          status?: string;
          updated_at?: number;
          variable_changing_day_registry_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'care_sessions_patient_id_fkey';
            columns: ['patient_id'];
            isOneToOne: false;
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
        ];
      };
      care_target_instances: {
        Row: {
          achieved_at: number | null;
          cancel_at: number | null;
          created_at: number;
          current_value: number | null;
          current_value_formula_json: string;
          deleted_at: number | null;
          id: string;
          initial_value: number | null;
          session_id: string | null;
          set_at: number;
          set_by_trigger_id: string | null;
          set_by_user_id: string | null;
          source_code: string;
          source_id: string;
          source_type: string;
          status: string;
          target_formula_json: string;
          target_value: number | null;
          updated_at: number;
          variable_code: string;
          variable_type: string;
        };
        Insert: {
          achieved_at?: number | null;
          cancel_at?: number | null;
          created_at: number;
          current_value?: number | null;
          current_value_formula_json: string;
          deleted_at?: number | null;
          id: string;
          initial_value?: number | null;
          session_id?: string | null;
          set_at: number;
          set_by_trigger_id?: string | null;
          set_by_user_id?: string | null;
          source_code: string;
          source_id: string;
          source_type: string;
          status: string;
          target_formula_json: string;
          target_value?: number | null;
          updated_at: number;
          variable_code: string;
          variable_type: string;
        };
        Update: {
          achieved_at?: number | null;
          cancel_at?: number | null;
          created_at?: number;
          current_value?: number | null;
          current_value_formula_json?: string;
          deleted_at?: number | null;
          id?: string;
          initial_value?: number | null;
          session_id?: string | null;
          set_at?: number;
          set_by_trigger_id?: string | null;
          set_by_user_id?: string | null;
          source_code?: string;
          source_id?: string;
          source_type?: string;
          status?: string;
          target_formula_json?: string;
          target_value?: number | null;
          updated_at?: number;
          variable_code?: string;
          variable_type?: string;
        };
        Relationships: [];
      };
      checkpoint_instances: {
        Row: {
          checkpoint_identifier: string;
          checkpoint_metadata_json: string;
          container_id: string;
          container_started_at: number;
          container_type: string;
          created_at: number;
          created_by: string | null;
          deleted_at: number | null;
          executed_at: number | null;
          execution_count: number;
          execution_mode: string;
          id: string;
          scheduled_for: number;
          session_id: string | null;
          source_id: string;
          source_type: string;
          status: string;
          task_completion_deadline: number | null;
          tasks_triggered_at: number | null;
          updated_at: number;
        };
        Insert: {
          checkpoint_identifier: string;
          checkpoint_metadata_json: string;
          container_id: string;
          container_started_at: number;
          container_type: string;
          created_at: number;
          created_by?: string | null;
          deleted_at?: number | null;
          executed_at?: number | null;
          execution_count: number;
          execution_mode: string;
          id: string;
          scheduled_for: number;
          session_id?: string | null;
          source_id: string;
          source_type: string;
          status: string;
          task_completion_deadline?: number | null;
          tasks_triggered_at?: number | null;
          updated_at: number;
        };
        Update: {
          checkpoint_identifier?: string;
          checkpoint_metadata_json?: string;
          container_id?: string;
          container_started_at?: number;
          container_type?: string;
          created_at?: number;
          created_by?: string | null;
          deleted_at?: number | null;
          executed_at?: number | null;
          execution_count?: number;
          execution_mode?: string;
          id?: string;
          scheduled_for?: number;
          session_id?: string | null;
          source_id?: string;
          source_type?: string;
          status?: string;
          task_completion_deadline?: number | null;
          tasks_triggered_at?: number | null;
          updated_at?: number;
        };
        Relationships: [];
      };
      complications: {
        Row: {
          can_be_edited: boolean;
          code: string;
          created_at: number;
          deleted_at: number | null;
          id: string;
          is_edited_by_admin: boolean;
          is_present: boolean;
          medical_record_id: string;
          updated_at: number;
        };
        Insert: {
          can_be_edited: boolean;
          code: string;
          created_at: number;
          deleted_at?: number | null;
          id: string;
          is_edited_by_admin: boolean;
          is_present: boolean;
          medical_record_id: string;
          updated_at: number;
        };
        Update: {
          can_be_edited?: boolean;
          code?: string;
          created_at?: number;
          deleted_at?: number | null;
          id?: string;
          is_edited_by_admin?: boolean;
          is_present?: boolean;
          medical_record_id?: string;
          updated_at?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'complications_medical_record_id_fkey';
            columns: ['medical_record_id'];
            isOneToOne: false;
            referencedRelation: 'medical_records';
            referencedColumns: ['id'];
          },
        ];
      };
      conditional_trigger_states: {
        Row: {
          condition_currently_met: boolean;
          container_id: string;
          container_type: string;
          created_at: number;
          current_cycle_executed: boolean;
          deleted_at: number | null;
          id: string;
          last_condition_evaluated_at: number | null;
          last_executed_at: number | null;
          last_executing_trigger_id: string | null;
          session_id: string | null;
          source_id: string;
          source_type: string;
          total_execution_count: number;
          trigger_action: string;
          trigger_id: string;
          updated_at: number;
        };
        Insert: {
          condition_currently_met: boolean;
          container_id: string;
          container_type: string;
          created_at: number;
          current_cycle_executed: boolean;
          deleted_at?: number | null;
          id: string;
          last_condition_evaluated_at?: number | null;
          last_executed_at?: number | null;
          last_executing_trigger_id?: string | null;
          session_id?: string | null;
          source_id: string;
          source_type: string;
          total_execution_count: number;
          trigger_action: string;
          trigger_id: string;
          updated_at: number;
        };
        Update: {
          condition_currently_met?: boolean;
          container_id?: string;
          container_type?: string;
          created_at?: number;
          current_cycle_executed?: boolean;
          deleted_at?: number | null;
          id?: string;
          last_condition_evaluated_at?: number | null;
          last_executed_at?: number | null;
          last_executing_trigger_id?: string | null;
          session_id?: string | null;
          source_id?: string;
          source_type?: string;
          total_execution_count?: number;
          trigger_action?: string;
          trigger_id?: string;
          updated_at?: number;
        };
        Relationships: [];
      };
      data_collection_tasks: {
        Row: {
          category: string;
          collected_fields_json: string;
          completed_at: number | null;
          created_at: number;
          deleted_at: number | null;
          id: string;
          phase_execution_id: string;
          requirements_json: string;
          skipped_at: number | null;
          skipped_reason: string | null;
          source_id: string;
          source_type: string;
          status: string;
          trigger_identifier: string;
          updated_at: number;
        };
        Insert: {
          category: string;
          collected_fields_json: string;
          completed_at?: number | null;
          created_at: number;
          deleted_at?: number | null;
          id: string;
          phase_execution_id: string;
          requirements_json: string;
          skipped_at?: number | null;
          skipped_reason?: string | null;
          source_id: string;
          source_type: string;
          status: string;
          trigger_identifier: string;
          updated_at: number;
        };
        Update: {
          category?: string;
          collected_fields_json?: string;
          completed_at?: number | null;
          created_at?: number;
          deleted_at?: number | null;
          id?: string;
          phase_execution_id?: string;
          requirements_json?: string;
          skipped_at?: number | null;
          skipped_reason?: string | null;
          source_id?: string;
          source_type?: string;
          status?: string;
          trigger_identifier?: string;
          updated_at?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'data_collection_tasks_phase_execution_id_fkey';
            columns: ['phase_execution_id'];
            isOneToOne: false;
            referencedRelation: 'care_phase_executions';
            referencedColumns: ['id'];
          },
        ];
      };
      data_field_responses: {
        Row: {
          can_be_edited: boolean;
          code: string;
          context: string;
          created_at: number;
          data: string;
          deleted_at: number | null;
          id: string;
          medical_record_id: string;
          updated_at: number;
        };
        Insert: {
          can_be_edited: boolean;
          code: string;
          context: string;
          created_at: number;
          data: string;
          deleted_at?: number | null;
          id: string;
          medical_record_id: string;
          updated_at: number;
        };
        Update: {
          can_be_edited?: boolean;
          code?: string;
          context?: string;
          created_at?: number;
          data?: string;
          deleted_at?: number | null;
          id?: string;
          medical_record_id?: string;
          updated_at?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'data_field_responses_medical_record_id_fkey';
            columns: ['medical_record_id'];
            isOneToOne: false;
            referencedRelation: 'medical_records';
            referencedColumns: ['id'];
          },
        ];
      };
      departments: {
        Row: {
          chief_town: string;
          code: string;
          id: string;
          name: string;
        };
        Insert: {
          chief_town: string;
          code: string;
          id: string;
          name: string;
        };
        Update: {
          chief_town?: string;
          code?: string;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      facilities: {
        Row: {
          city: string;
          department_id: string;
          has_cna: boolean;
          has_cnt: boolean;
          health_zone_id: string | null;
          id: string;
          level: string;
          name: string;
          sector: string;
          short_name: string;
          type: string;
        };
        Insert: {
          city: string;
          department_id: string;
          has_cna: boolean;
          has_cnt: boolean;
          health_zone_id?: string | null;
          id: string;
          level: string;
          name: string;
          sector: string;
          short_name: string;
          type: string;
        };
        Update: {
          city?: string;
          department_id?: string;
          has_cna?: boolean;
          has_cnt?: boolean;
          health_zone_id?: string | null;
          id?: string;
          level?: string;
          name?: string;
          sector?: string;
          short_name?: string;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'facilities_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'facilities_health_zone_id_fkey';
            columns: ['health_zone_id'];
            isOneToOne: false;
            referencedRelation: 'health_zones';
            referencedColumns: ['id'];
          },
        ];
      };
      health_zones: {
        Row: {
          communes: string[];
          department_id: string;
          id: string;
          name: string;
        };
        Insert: {
          communes: string[];
          department_id: string;
          id: string;
          name: string;
        };
        Update: {
          communes?: string[];
          department_id?: string;
          id?: string;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'health_zones_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
        ];
      };
      hospital_services: {
        Row: {
          facility_id: string;
          id: string;
          is_mas_capable: boolean;
          name: string;
          nutrition_unit_type: string | null;
          service_type: string;
        };
        Insert: {
          facility_id: string;
          id: string;
          is_mas_capable: boolean;
          name: string;
          nutrition_unit_type?: string | null;
          service_type: string;
        };
        Update: {
          facility_id?: string;
          id?: string;
          is_mas_capable?: boolean;
          name?: string;
          nutrition_unit_type?: string | null;
          service_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'hospital_services_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
        ];
      };
      medical_decision_requests: {
        Row: {
          config_json: string;
          created_at: number;
          deleted_at: number | null;
          expected_response_type: string;
          expired_at: number | null;
          id: string;
          processed_at: number | null;
          requested_at: number;
          response_json: string | null;
          session_id: string | null;
          source_code: string;
          source_id: string;
          source_type: string;
          status: string;
          trigger_source_id: string;
          updated_at: number;
        };
        Insert: {
          config_json: string;
          created_at: number;
          deleted_at?: number | null;
          expected_response_type: string;
          expired_at?: number | null;
          id: string;
          processed_at?: number | null;
          requested_at: number;
          response_json?: string | null;
          session_id?: string | null;
          source_code: string;
          source_id: string;
          source_type: string;
          status: string;
          trigger_source_id: string;
          updated_at: number;
        };
        Update: {
          config_json?: string;
          created_at?: number;
          deleted_at?: number | null;
          expected_response_type?: string;
          expired_at?: number | null;
          id?: string;
          processed_at?: number | null;
          requested_at?: number;
          response_json?: string | null;
          session_id?: string | null;
          source_code?: string;
          source_id?: string;
          source_type?: string;
          status?: string;
          trigger_source_id?: string;
          updated_at?: number;
        };
        Relationships: [];
      };
      medical_records: {
        Row: {
          created_at: number;
          deleted_at: number | null;
          id: string;
          patient_id: string;
          updated_at: number;
        };
        Insert: {
          created_at: number;
          deleted_at?: number | null;
          id: string;
          patient_id: string;
          updated_at: number;
        };
        Update: {
          created_at?: number;
          deleted_at?: number | null;
          id?: string;
          patient_id?: string;
          updated_at?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'medical_records_patient_id_fkey';
            columns: ['patient_id'];
            isOneToOne: false;
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
        ];
      };
      monitoring_instances: {
        Row: {
          category: string;
          code: string;
          completed_at: number | null;
          created_at: number;
          deleted_at: number | null;
          duration_json: string;
          frequency_json: string;
          id: string;
          initiated_by_trigger_id: string;
          last_window_generated_up_to: number | null;
          monitoring_identifier: string;
          session_id: string | null;
          source: string;
          source_checkpoint_instance_id: string | null;
          source_id: string;
          source_type: string;
          started_at: number;
          status: string;
          stopped_at: number | null;
          stopped_by_trigger_id: string | null;
          updated_at: number;
        };
        Insert: {
          category: string;
          code: string;
          completed_at?: number | null;
          created_at: number;
          deleted_at?: number | null;
          duration_json: string;
          frequency_json: string;
          id: string;
          initiated_by_trigger_id: string;
          last_window_generated_up_to?: number | null;
          monitoring_identifier: string;
          session_id?: string | null;
          source: string;
          source_checkpoint_instance_id?: string | null;
          source_id: string;
          source_type: string;
          started_at: number;
          status: string;
          stopped_at?: number | null;
          stopped_by_trigger_id?: string | null;
          updated_at: number;
        };
        Update: {
          category?: string;
          code?: string;
          completed_at?: number | null;
          created_at?: number;
          deleted_at?: number | null;
          duration_json?: string;
          frequency_json?: string;
          id?: string;
          initiated_by_trigger_id?: string;
          last_window_generated_up_to?: number | null;
          monitoring_identifier?: string;
          session_id?: string | null;
          source?: string;
          source_checkpoint_instance_id?: string | null;
          source_id?: string;
          source_type?: string;
          started_at?: number;
          status?: string;
          stopped_at?: number | null;
          stopped_by_trigger_id?: string | null;
          updated_at?: number;
        };
        Relationships: [];
      };
      monitoring_tasks: {
        Row: {
          category: string;
          collected_fields_json: string;
          completed_at: number | null;
          completed_by: string | null;
          created_at: number;
          deleted_at: number | null;
          expires_at: number;
          generation_key: string;
          id: string;
          internal_sequence: number;
          is_late_entry: boolean;
          missed_at: number | null;
          monitoring_code: string;
          monitoring_instance_id: string | null;
          must_be_completed_after_id: string | null;
          reported_occurrence_at: number | null;
          resolved_template_json: string | null;
          session_id: string | null;
          skipped_at: number | null;
          skipped_reason: string | null;
          source: string;
          source_checkpoint_instance_id: string | null;
          source_id: string;
          source_type: string;
          status: string;
          updated_at: number;
          valid_from: number;
        };
        Insert: {
          category: string;
          collected_fields_json: string;
          completed_at?: number | null;
          completed_by?: string | null;
          created_at: number;
          deleted_at?: number | null;
          expires_at: number;
          generation_key: string;
          id: string;
          internal_sequence: number;
          is_late_entry: boolean;
          missed_at?: number | null;
          monitoring_code: string;
          monitoring_instance_id?: string | null;
          must_be_completed_after_id?: string | null;
          reported_occurrence_at?: number | null;
          resolved_template_json?: string | null;
          session_id?: string | null;
          skipped_at?: number | null;
          skipped_reason?: string | null;
          source: string;
          source_checkpoint_instance_id?: string | null;
          source_id: string;
          source_type: string;
          status: string;
          updated_at: number;
          valid_from: number;
        };
        Update: {
          category?: string;
          collected_fields_json?: string;
          completed_at?: number | null;
          completed_by?: string | null;
          created_at?: number;
          deleted_at?: number | null;
          expires_at?: number;
          generation_key?: string;
          id?: string;
          internal_sequence?: number;
          is_late_entry?: boolean;
          missed_at?: number | null;
          monitoring_code?: string;
          monitoring_instance_id?: string | null;
          must_be_completed_after_id?: string | null;
          reported_occurrence_at?: number | null;
          resolved_template_json?: string | null;
          session_id?: string | null;
          skipped_at?: number | null;
          skipped_reason?: string | null;
          source?: string;
          source_checkpoint_instance_id?: string | null;
          source_id?: string;
          source_type?: string;
          status?: string;
          updated_at?: number;
          valid_from?: number;
        };
        Relationships: [];
      };
      nutritional_summaries: {
        Row: {
          biological_analysis_results: string;
          clinical_analysis_results: string;
          created_at: number;
          deleted_at: number | null;
          diagnostic_results: string;
          id: string;
          indicator_values: string;
          notes: string;
          patient_id: string;
          updated_at: number;
          used_variables: string;
        };
        Insert: {
          biological_analysis_results: string;
          clinical_analysis_results: string;
          created_at: number;
          deleted_at?: number | null;
          diagnostic_results: string;
          id: string;
          indicator_values: string;
          notes: string;
          patient_id: string;
          updated_at: number;
          used_variables: string;
        };
        Update: {
          biological_analysis_results?: string;
          clinical_analysis_results?: string;
          created_at?: number;
          deleted_at?: number | null;
          diagnostic_results?: string;
          id?: string;
          indicator_values?: string;
          notes?: string;
          patient_id?: string;
          updated_at?: number;
          used_variables?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'nutritional_summaries_patient_id_fkey';
            columns: ['patient_id'];
            isOneToOne: false;
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
        ];
      };
      nutritional_summary_notes: {
        Row: {
          content: string;
          created_at: number;
          deleted_at: number | null;
          id: string;
          nutritional_summary_id: string;
          updated_at: number;
        };
        Insert: {
          content: string;
          created_at: number;
          deleted_at?: number | null;
          id: string;
          nutritional_summary_id: string;
          updated_at: number;
        };
        Update: {
          content?: string;
          created_at?: number;
          deleted_at?: number | null;
          id?: string;
          nutritional_summary_id?: string;
          updated_at?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'nutritional_summary_notes_nutritional_summary_id_fkey';
            columns: ['nutritional_summary_id'];
            isOneToOne: false;
            referencedRelation: 'nutritional_summaries';
            referencedColumns: ['id'];
          },
        ];
      };
      orientation_records: {
        Row: {
          can_be_edited: boolean;
          code: string;
          created_at: number;
          deleted_at: number | null;
          id: string;
          medical_record_id: string;
          treatment_phase: string | null;
          updated_at: number;
        };
        Insert: {
          can_be_edited: boolean;
          code: string;
          created_at: number;
          deleted_at?: number | null;
          id: string;
          medical_record_id: string;
          treatment_phase?: string | null;
          updated_at: number;
        };
        Update: {
          can_be_edited?: boolean;
          code?: string;
          created_at?: number;
          deleted_at?: number | null;
          id?: string;
          medical_record_id?: string;
          treatment_phase?: string | null;
          updated_at?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'orientation_records_medical_record_id_fkey';
            columns: ['medical_record_id'];
            isOneToOne: false;
            referencedRelation: 'medical_records';
            referencedColumns: ['id'];
          },
        ];
      };
      outbox: {
        Row: {
          created_at: number;
          deleted_at: number | null;
          event_type: string;
          id: string;
          patient_id: string;
          payload: string;
          retry_count: number;
          status: string;
          updated_at: number;
          user_id: string | null;
        };
        Insert: {
          created_at: number;
          deleted_at?: number | null;
          event_type: string;
          id: string;
          patient_id: string;
          payload: string;
          retry_count: number;
          status: string;
          updated_at: number;
          user_id?: string | null;
        };
        Update: {
          created_at?: number;
          deleted_at?: number | null;
          event_type?: string;
          id?: string;
          patient_id?: string;
          payload?: string;
          retry_count?: number;
          status?: string;
          updated_at?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'outbox_patient_id_fkey';
            columns: ['patient_id'];
            isOneToOne: false;
            referencedRelation: 'patients';
            referencedColumns: ['id'];
          },
        ];
      };
      p2p_clients: {
        Row: {
          connected_at: number | null;
          device_id: string;
          id: string;
          is_deleted: boolean;
          last_sync_timestamp: number | null;
          name: string;
          sessions: Json;
          total_data_shared: number;
          total_sync_duration: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          connected_at?: number | null;
          device_id: string;
          id: string;
          is_deleted?: boolean;
          last_sync_timestamp?: number | null;
          name: string;
          sessions?: Json;
          total_data_shared?: number;
          total_sync_duration?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          connected_at?: number | null;
          device_id?: string;
          id?: string;
          is_deleted?: boolean;
          last_sync_timestamp?: number | null;
          name?: string;
          sessions?: Json;
          total_data_shared?: number;
          total_sync_duration?: number;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      patients: {
        Row: {
          address: string;
          birth_at: number;
          contact: string;
          created_at: number;
          deleted_at: number | null;
          gender: string;
          id: string;
          name: string;
          parents: string;
          status: string;
          updated_at: number;
          user_id: string | null;
        };
        Insert: {
          address: string;
          birth_at: number;
          contact: string;
          created_at: number;
          deleted_at?: number | null;
          gender: string;
          id: string;
          name: string;
          parents: string;
          status: string;
          updated_at: number;
          user_id?: string | null;
        };
        Update: {
          address?: string;
          birth_at?: number;
          contact?: string;
          created_at?: number;
          deleted_at?: number | null;
          gender?: string;
          id?: string;
          name?: string;
          parents?: string;
          status?: string;
          updated_at?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'patients_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'patients_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'v_soignants';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          bio: string | null;
          created_at: number;
          department_id: string | null;
          display_name: string | null;
          facility_id: string | null;
          health_zone_id: string | null;
          id: string;
          is_active: boolean;
          origin_app: string;
          phone: string | null;
          profession: string | null;
          role: string;
          service_id: string | null;
          specialty: string | null;
        };
        Insert: {
          bio?: string | null;
          created_at?: number;
          department_id?: string | null;
          display_name?: string | null;
          facility_id?: string | null;
          health_zone_id?: string | null;
          id: string;
          is_active?: boolean;
          origin_app?: string;
          phone?: string | null;
          profession?: string | null;
          role?: string;
          service_id?: string | null;
          specialty?: string | null;
        };
        Update: {
          bio?: string | null;
          created_at?: number;
          department_id?: string | null;
          display_name?: string | null;
          facility_id?: string | null;
          health_zone_id?: string | null;
          id?: string;
          is_active?: boolean;
          origin_app?: string;
          phone?: string | null;
          profession?: string | null;
          role?: string;
          service_id?: string | null;
          specialty?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_health_zone_id_fkey';
            columns: ['health_zone_id'];
            isOneToOne: false;
            referencedRelation: 'health_zones';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'hospital_services';
            referencedColumns: ['id'];
          },
        ];
      };
      treatment_actions: {
        Row: {
          collected_fields_json: string;
          completed_at: number | null;
          completed_by: string | null;
          created_at: number;
          deleted_at: number | null;
          dosage_formula_json: string | null;
          expires_at: number;
          generation_key: string;
          id: string;
          indications_json: string | null;
          internal_sequence: number;
          is_late_entry: boolean;
          is_not_applicable: boolean;
          missed_at: number | null;
          must_be_completed_after_key: string | null;
          on_completion_tasks_json: string;
          reported_occurrence_at: number | null;
          resolved_dosage_json: string | null;
          session_id: string | null;
          skipped_at: number | null;
          skipped_reason: string | null;
          source_id: string;
          source_type: string;
          status: string;
          treatment_code: string | null;
          treatment_initiated_by_trigger_id: string;
          treatment_instance_id: string | null;
          treatment_type: string;
          updated_at: number;
          valid_from: number;
        };
        Insert: {
          collected_fields_json: string;
          completed_at?: number | null;
          completed_by?: string | null;
          created_at: number;
          deleted_at?: number | null;
          dosage_formula_json?: string | null;
          expires_at: number;
          generation_key: string;
          id: string;
          indications_json?: string | null;
          internal_sequence: number;
          is_late_entry: boolean;
          is_not_applicable: boolean;
          missed_at?: number | null;
          must_be_completed_after_key?: string | null;
          on_completion_tasks_json: string;
          reported_occurrence_at?: number | null;
          resolved_dosage_json?: string | null;
          session_id?: string | null;
          skipped_at?: number | null;
          skipped_reason?: string | null;
          source_id: string;
          source_type: string;
          status: string;
          treatment_code?: string | null;
          treatment_initiated_by_trigger_id: string;
          treatment_instance_id?: string | null;
          treatment_type: string;
          updated_at: number;
          valid_from: number;
        };
        Update: {
          collected_fields_json?: string;
          completed_at?: number | null;
          completed_by?: string | null;
          created_at?: number;
          deleted_at?: number | null;
          dosage_formula_json?: string | null;
          expires_at?: number;
          generation_key?: string;
          id?: string;
          indications_json?: string | null;
          internal_sequence?: number;
          is_late_entry?: boolean;
          is_not_applicable?: boolean;
          missed_at?: number | null;
          must_be_completed_after_key?: string | null;
          on_completion_tasks_json?: string;
          reported_occurrence_at?: number | null;
          resolved_dosage_json?: string | null;
          session_id?: string | null;
          skipped_at?: number | null;
          skipped_reason?: string | null;
          source_id?: string;
          source_type?: string;
          status?: string;
          treatment_code?: string | null;
          treatment_initiated_by_trigger_id?: string;
          treatment_instance_id?: string | null;
          treatment_type?: string;
          updated_at?: number;
          valid_from?: number;
        };
        Relationships: [];
      };
      treatment_instances: {
        Row: {
          completed_at: number | null;
          created_at: number;
          current_dosage_formula_json: string | null;
          current_dosage_trigger_source_id: string | null;
          deleted_at: number | null;
          duration_json: string;
          frequency_json: string;
          id: string;
          indications_json: string | null;
          initiated_by_trigger_id: string;
          last_dosage_update_at: number | null;
          last_window_generated_up_to: number | null;
          on_completion_tasks_json: string;
          previous_dosage_formula_json: string | null;
          session_id: string | null;
          source_id: string;
          source_type: string;
          started_at: number;
          status: string;
          stopped_at: number | null;
          stopped_by_trigger_id: string | null;
          treatment_code: string | null;
          treatment_identifier: string;
          treatment_type: string;
          updated_at: number;
        };
        Insert: {
          completed_at?: number | null;
          created_at: number;
          current_dosage_formula_json?: string | null;
          current_dosage_trigger_source_id?: string | null;
          deleted_at?: number | null;
          duration_json: string;
          frequency_json: string;
          id: string;
          indications_json?: string | null;
          initiated_by_trigger_id: string;
          last_dosage_update_at?: number | null;
          last_window_generated_up_to?: number | null;
          on_completion_tasks_json: string;
          previous_dosage_formula_json?: string | null;
          session_id?: string | null;
          source_id: string;
          source_type: string;
          started_at: number;
          status: string;
          stopped_at?: number | null;
          stopped_by_trigger_id?: string | null;
          treatment_code?: string | null;
          treatment_identifier: string;
          treatment_type: string;
          updated_at: number;
        };
        Update: {
          completed_at?: number | null;
          created_at?: number;
          current_dosage_formula_json?: string | null;
          current_dosage_trigger_source_id?: string | null;
          deleted_at?: number | null;
          duration_json?: string;
          frequency_json?: string;
          id?: string;
          indications_json?: string | null;
          initiated_by_trigger_id?: string;
          last_dosage_update_at?: number | null;
          last_window_generated_up_to?: number | null;
          on_completion_tasks_json?: string;
          previous_dosage_formula_json?: string | null;
          session_id?: string | null;
          source_id?: string;
          source_type?: string;
          started_at?: number;
          status?: string;
          stopped_at?: number | null;
          stopped_by_trigger_id?: string | null;
          treatment_code?: string | null;
          treatment_identifier?: string;
          treatment_type?: string;
          updated_at?: number;
        };
        Relationships: [];
      };
      user_app_activity: {
        Row: {
          app: string;
          created_at: string;
          device_info: Json | null;
          first_seen_at: string;
          id: string;
          last_seen_at: string;
          login_count: number;
          user_id: string;
        };
        Insert: {
          app: string;
          created_at?: string;
          device_info?: Json | null;
          first_seen_at?: string;
          id?: string;
          last_seen_at?: string;
          login_count?: number;
          user_id: string;
        };
        Update: {
          app?: string;
          created_at?: string;
          device_info?: Json | null;
          first_seen_at?: string;
          id?: string;
          last_seen_at?: string;
          login_count?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_app_activity_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_app_activity_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'v_soignants';
            referencedColumns: ['id'];
          },
        ];
      };
      user_custom_templates: {
        Row: {
          data: Json;
          id: string;
          patient_id: string;
          store_name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          data?: Json;
          id?: string;
          patient_id: string;
          store_name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          data?: Json;
          id?: string;
          patient_id?: string;
          store_name?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      variable_changing_day_entries: {
        Row: {
          changed_at: number;
          created_at: number;
          current_marker: string;
          deleted_at: number | null;
          id: string;
          registry_id: string;
          source_code: string;
          source_id: string;
          source_trigger_identifier: string;
          source_type: string;
          updated_at: number;
          variable_code: string;
          variable_type: string;
        };
        Insert: {
          changed_at: number;
          created_at: number;
          current_marker: string;
          deleted_at?: number | null;
          id: string;
          registry_id: string;
          source_code: string;
          source_id: string;
          source_trigger_identifier: string;
          source_type: string;
          updated_at: number;
          variable_code: string;
          variable_type: string;
        };
        Update: {
          changed_at?: number;
          created_at?: number;
          current_marker?: string;
          deleted_at?: number | null;
          id?: string;
          registry_id?: string;
          source_code?: string;
          source_id?: string;
          source_trigger_identifier?: string;
          source_type?: string;
          updated_at?: number;
          variable_code?: string;
          variable_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'variable_changing_day_entries_registry_id_fkey';
            columns: ['registry_id'];
            isOneToOne: false;
            referencedRelation: 'variable_changing_day_registries';
            referencedColumns: ['id'];
          },
        ];
      };
      variable_changing_day_registries: {
        Row: {
          created_at: number;
          deleted_at: number | null;
          id: string;
          session_id: string;
          updated_at: number;
        };
        Insert: {
          created_at: number;
          deleted_at?: number | null;
          id: string;
          session_id: string;
          updated_at: number;
        };
        Update: {
          created_at?: number;
          deleted_at?: number | null;
          id?: string;
          session_id?: string;
          updated_at?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'variable_changing_day_registries_session_id_fkey';
            columns: ['session_id'];
            isOneToOne: false;
            referencedRelation: 'care_sessions';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      v_active_kpis: {
        Row: {
          active_sessions: number | null;
          blocking_decisions: number | null;
          completed_sessions: number | null;
          pending_decisions: number | null;
          sam_patients: number | null;
          total_patients: number | null;
          waiting_for_decision: number | null;
        };
        Relationships: [];
      };
      v_soignants: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: number | null;
          department_id: string | null;
          department_name: string | null;
          display_name: string | null;
          email: string | null;
          facility_id: string | null;
          facility_level: string | null;
          facility_name: string | null;
          facility_short_name: string | null;
          facility_type: string | null;
          full_name: string | null;
          health_zone_id: string | null;
          health_zone_name: string | null;
          id: string | null;
          is_active: boolean | null;
          nutrition_unit_type: string | null;
          phone: string | null;
          profession: string | null;
          role: string | null;
          service_id: string | null;
          service_name: string | null;
          specialty: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_department_id_fkey';
            columns: ['department_id'];
            isOneToOne: false;
            referencedRelation: 'departments';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_facility_id_fkey';
            columns: ['facility_id'];
            isOneToOne: false;
            referencedRelation: 'facilities';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_health_zone_id_fkey';
            columns: ['health_zone_id'];
            isOneToOne: false;
            referencedRelation: 'health_zones';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profiles_service_id_fkey';
            columns: ['service_id'];
            isOneToOne: false;
            referencedRelation: 'hospital_services';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      compute_icrp: {
        Args: { p_from: number; p_to: number };
        Returns: {
          icrp_level: string;
          icrp_score: number;
          patient_id: string;
          session_id: string;
          tck_pct: number;
          tcp_pct: number;
          tcs_pct: number;
          tr_pct: number;
        }[];
      };
      get_checkpoint_adherence: {
        Args: { p_from: number; p_to: number };
        Returns: {
          cancelled: number;
          container_type: string;
          executed: number;
          execution_mode: string;
          phase_code: string;
          skipped: number;
          tck_pct: number;
        }[];
      };
      get_complications_prevalence: {
        Args: { p_from: number; p_to: number };
        Returns: {
          code: string;
          present: number;
          prevalence_pct: number;
          total: number;
        }[];
      };
      get_decision_delays: {
        Args: { p_from: number; p_to: number };
        Returns: {
          avg_delay_min: number;
          expected_response_type: string;
          expired_count: number;
          is_blocking: boolean;
          median_delay_min: number;
          responded_within_1h: number;
          total: number;
          tr_pct: number;
        }[];
      };
      get_monitoring_adherence: {
        Args: { p_from: number; p_to: number };
        Returns: {
          category: string;
          completed: number;
          late_completed: number;
          missed: number;
          monitoring_code: string;
          tcs_pct: number;
          total_eval: number;
        }[];
      };
      get_phase_stats: {
        Args: { p_from: number; p_to: number };
        Returns: {
          avg_duration_days: number;
          enforced: number;
          enforced_pct: number;
          failed: number;
          median_dur_days: number;
          phase_code: string;
          resolution_pct: number;
          resolved: number;
          running: number;
          total: number;
        }[];
      };
      get_population_stats: {
        Args: { p_from: number; p_to: number };
        Returns: Json;
      };
      get_session_outcomes: {
        Args: { p_from: number; p_to: number };
        Returns: {
          abandoned_reason: string;
          avg_duration_days: number;
          count: number;
          median_dur_days: number;
          pct: number;
          status: string;
        }[];
      };
      get_treatment_adherence: {
        Args: { p_from: number; p_phase_code?: string; p_to: number };
        Returns: {
          completed: number;
          late_completed: number;
          missed: number;
          phase_code: string;
          skipped: number;
          tcp_pct: number;
          total_eval: number;
          treatment_type: string;
        }[];
      };
      get_weekly_trend: {
        Args: { p_from: number; p_to: number };
        Returns: {
          new_patients: number;
          new_sessions: number;
          tcp_avg: number;
          tcs_avg: number;
          week_start: string;
        }[];
      };
      get_weight_evolution: {
        Args: { p_from: number; p_to: number };
        Returns: {
          admission_date: number;
          admission_weight: number;
          duration_days: number;
          followup_date: number;
          followup_weight: number;
          gqp_g_kg_day: number;
          patient_id: string;
          response_category: string;
        }[];
      };
      is_analyst: { Args: never; Returns: boolean };
      process_delete:
        | { Args: { rec_id: string; t_name: string }; Returns: undefined }
        | { Args: { record_id: string; tbl: string }; Returns: undefined };
      process_upsert: {
        Args: { r_data: Json; t_name: string };
        Returns: undefined;
      };
      sync_pull: { Args: { last_pulled_at: number }; Returns: Json };
      sync_push: { Args: { changes: Json }; Returns: undefined };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
