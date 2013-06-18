class FcoController < ApplicationController

  def pay_legalisation_post
    @transaction_title = 'Pay to get documents legalised by post'
    @transaction_slug = 'pay-legalisation-post'
    render_index
  end
  
  def pay_legalisation_drop_off
    @transaction_title = 'Pay to legalise documents using the premium service'
    @transaction_slug = 'pay-legalisation-drop-off'
    render_index
  end
  
  def pay_register_birth_abroad
    @transaction_title = 'Payment to register a birth abroad in the UK'
    @transaction_slug = 'pay-register-birth-abroad'
    render_index
  end
  
  def pay_register_death_abroad
    @transaction_title = 'Payment to register a death abroad'
    @transaction_slug = 'pay-register-death-abroad'
    render_index
  end
  
  def pay_foreign_marriage_certificates
    @transaction_title = 'Payment for certificates to get married abroad'
    @transaction_slug = 'pay-foreign-marriage-certificates'
    render_index
  end
  
  def deposit_foreign_marriage
    @transaction_title = 'Deposit foreign marriage or civil partnership certificates'
    @transaction_slug = 'deposit-foreign-marriage'
    render_index
  end

  private

  def render_index
    respond_to do |format|
        format.html { render :template => "fco/index" }
    end
  end

end
